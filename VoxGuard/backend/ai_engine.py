"""
VoxGuard AI Engine - Cascaded Translation Pipeline
Mission Critical: Kashmiri Audio -> Kashmiri Text -> English Text
Architecture: Cascaded Pipeline (ASR + NMT)
"""

import os

import librosa
import nemo.collections.asr as nemo_asr
import noisereduce as nr
import soundfile as sf
import torch
from huggingface_hub import login
from IndicTransToolkit import IndicProcessor
from transformers import (
    AutoModelForSeq2SeqLM,
    AutoProcessor,
    AutoTokenizer,
    Wav2Vec2ForCTC,
)

# Store model load errors so the API can surface them in the UI
MODEL_LOAD_ERRORS = {"asr": None, "nmt": None}

# ==================================================================================
# SYSTEM DESIGN & ARCHITECTURE NOTES
# ==================================================================================
# Stage 1: Automatic Speech Recognition (ASR)
# Model: KhushiDS/wav2vec2-large-xlsr-53-Kashmiri (Fine-tuned XLS-R)
# Strategy: Direct inference on Kashmiri audio
# 
# Stage 2: Neural Machine Translation (NMT)
# Model: AI4Bharat's IndicTrans2 (1B parameters)
# ==================================================================================

# Device Configuration
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
print(f"[AI ENGINE] Inference Device: {DEVICE}")

# Optional Hugging Face authentication for gated models (IndicTrans2)
HF_TOKEN = os.getenv("HF_TOKEN") or os.getenv("HUGGINGFACE_HUB_TOKEN")
if HF_TOKEN:
    try:
        login(token=HF_TOKEN, add_to_git_credential=False)
        print("[AI ENGINE] Hugging Face token loaded.")
    except Exception as e:
        print(f"[AI ENGINE WARNING] HF token login failed: {e}")

# ==================================================================================
# CUSTOM ASR CLASS (Kashmiri MMS)
# ==================================================================================


class KashmiriASR:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        # Using Dedicated Kashmiri Model directly (More reliable than MMS adapter)
        self.model_id = "KhushiDS/wav2vec2-large-xlsr-53-Kashmiri" 
        self._load_pipeline()

    def _load_pipeline(self):
        print(f"[System] Initializing ASR Stage 1 on {self.device}...")

        try:
            print(f"[System] Loading ASR Model: {self.model_id}...")
            self.processor = AutoProcessor.from_pretrained(self.model_id)
            self.model = Wav2Vec2ForCTC.from_pretrained(self.model_id).to(self.device)
            print(f"[System] Success: ASR Model Loaded.")
            
        except Exception as e:
            print(f"[Critical Error] ASR Model Load Failed: {e}")
            raise e

    def transcribe(self, audio_path):
        # Strict resampling to 16kHz is required
        audio, _ = librosa.load(audio_path, sr=16000)

        inputs = self.processor(
            audio, sampling_rate=16000, return_tensors="pt", padding=True
        ).to(self.device)

        with torch.no_grad():
            # Standard Wav2Vec2 inference
            outputs = self.model(inputs.input_values).logits

        ids = torch.argmax(outputs, dim=-1)[0]
        transcription = self.processor.decode(ids)

        return transcription


class IndicASR:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        # Primary: Meta MMS (High Quality)
        self.primary_id = (
            "/home/alwin/Downloads/indicconformer_stt_ks_hybrid_rnnt_large.nemo"
        )
        # self.primary_id = "ai4bharat/indicconformer_stt_ks_hybrid_rnnt_large"

        self._load_pipeline()

    def _load_pipeline(self):
        print(f"[System] Initializing ASR Stage 1 on {self.device}...")

        try:
            print("[System] Attempting to load MMS Adapter...")
            self.model = nemo_asr.models.ASRModel.restore_from(self.primary_id)

            self.model.freeze()  # inference mode
            self.model = self.model.to(self.device)  # transfer model to device
            print("[System] Success: loaded.")

        except Exception as e:
            # ATTEMPT 2: Fallback to Backup Model (If MMS fails)
            print(
                f"[Warning] MMS Adapter failed ({str(e)}). Switching to Backup Model..."
            )

    def transcribe(self, audio_path):
        # Strict resampling to 16kHz is required for both models
        audio, _ = librosa.load(audio_path, sr=16000)

        with torch.no_grad():
            # MMS requires checking logits specifically
            self.model.cur_decoder = "ctc"
            asr_text = self.model.transcribe(
                [audio_path], batch_size=1, logprobs=False, language_id="ks"
            )[0]

        return asr_text[0]


# ==================================================================================
# MODEL LOADING
# ==================================================================================

print("[AI ENGINE] Loading Stage 1: ASR Model (Kashmiri)...")
asr_engine = None
try:
    asr_engine = IndicASR()
    print("[AI ENGINE] ASR Model Loaded Successfully.")
except Exception as e:
    print(f"[AI ENGINE CRITICAL ERROR] Failed to load ASR Model: {e}")
    MODEL_LOAD_ERRORS["asr"] = str(e)


# ==================================================================================
# CUSTOM NMT CLASS (IndicTrans2)
# ==================================================================================


class IndicTranslator:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        # We use the 1B model which is fast and accurate for Kashmiri -> English
        self.model_name = "ai4bharat/indictrans2-indic-en-1B"
        self._load_model()

    def _load_model(self):
        print(f"[System] Initializing NMT (Translation) on {self.device}...")
        try:
            # trust_remote_code=True is REQUIRED for IndicTrans2
            self.tokenizer = AutoTokenizer.from_pretrained(
                self.model_name, trust_remote_code=True
            )
            self.model = AutoModelForSeq2SeqLM.from_pretrained(
                self.model_name, trust_remote_code=True
            ).to(self.device)
            self.ip = IndicProcessor(inference=True)
            print("[System] Success: NMT Model Loaded (Standard PyTorch).")
        except Exception as e:
            print(f"[Critical Error] NMT Load Failed: {e}")
            raise e

    def translate(self, text):
        if not text or len(text.strip()) == 0:
            return ""

        # IndicTrans2 Prompting: It's best to explicitly setting src and tgt
        # For this specific model, we let the tokenizer handle the formatting
        # Source: Kashmiri (Arabic Script) -> Target: English

        # Preprocess with IndicProcessor
        batch_input = self.ip.preprocess_batch(
            [text], src_lang="kas_Arab", tgt_lang="eng_Latn"
        )

        batch = self.tokenizer(
            batch_input, padding="longest", truncation=True, return_tensors="pt"
        ).to(self.device)

        with torch.no_grad():
            generated_tokens = self.model.generate(
                **batch, num_beams=5, max_length=256, min_length=1
            )

        # Decode
        decoded = self.tokenizer.batch_decode(
            generated_tokens, skip_special_tokens=True
        )[0]
        translation = self.ip.postprocess_batch([decoded], lang="eng_Latn")[0]

        return translation


print("[AI ENGINE] Loading Stage 2: IndicTrans2 NMT Model (Indic-to-En)...")
nmt_engine = None

try:
    nmt_engine = IndicTranslator()
    print("[AI ENGINE] IndicTrans2 NMT Loaded Successfully.")
except Exception as e:
    print(f"[AI ENGINE CRITICAL ERROR] Failed to load NMT Model: {e}")
    MODEL_LOAD_ERRORS["nmt"] = str(e)

# ==================================================================================
# PROCESSING PIPELINE
# ==================================================================================


def clean_audio(file_path):
    """
    Standard noise reduction to improve ASR accuracy.
    """
    print(f"[AI ENGINE] Loading audio for cleaning: {file_path}")
    # Load with original sample rate for cleaning, handling noise naturally
    audio_data, sample_rate = librosa.load(file_path, sr=None)

    cleaned_audio = nr.reduce_noise(y=audio_data, sr=sample_rate, prop_decrease=0.75)

    cleaned_path = file_path.replace(".wav", "_cleaned.wav")
    sf.write(cleaned_path, cleaned_audio, sample_rate)
    return cleaned_path


def analyze_audio(file_path):
    """
    Executes the cascaded ASR -> NMT pipeline.
    """
    if not asr_engine:
        return {
            "status": "error",
            "message": (
                "ASR Model failed to load. "
                f"Error: {MODEL_LOAD_ERRORS.get('asr') or 'Unknown'}"
            ),
            "threat_level": "UNKNOWN",
        }

    cleaned_file = None
    try:
        print(f"\n[AI ENGINE] Starting Analysis Pipeline for: {file_path}")

        # 1. Cleaning
        cleaned_file = clean_audio(file_path)

        # 2. Stage 1: ASR (Audio -> Kashmiri Text)
        print("[AI ENGINE] Stage 1: Executing ASR (MMS-1B)...")
        kashmiri_text = asr_engine.transcribe(cleaned_file)

        print(f"[AI ENGINE] Intermediate ASR Output (Native Script): {kashmiri_text}")

        if not kashmiri_text.strip():
            return {
                "status": "success",
                "original_text": "[NO SPEECH DETECTED]",
                "translated_text": "[NO SPEECH DETECTED]",
                "threat_level": "LOW",
                "entities": [],
            }

        # 3. Stage 2: NMT (Kashmiri Text -> English Text)
        if nmt_engine:
            print("[AI ENGINE] Stage 2: Executing NMT (IndicTrans2)...")

            try:
                translated_text = nmt_engine.translate(kashmiri_text)
                print(f"[AI ENGINE] Final Translation: {translated_text}")
            except Exception as e:
                print(f"[AI ENGINE WARNING] Translation failed: {e}")
                translated_text = "(Translation Error)"

        else:
            print("[AI ENGINE WARNING] NMT Model unavailable. Skipping translation.")
            translated_text = "(Translation Unavailable - Check NMT Access)"

        # 4. Threat Assessment
        threat_analysis = assess_threat(translated_text)

        return {
            "status": "success",
            "original_text": kashmiri_text,
            "translated_text": translated_text,
            "threat_level": threat_analysis["level"],
            "entities": threat_analysis["entities"],
        }

    except Exception as e:
        print(f"[AI ENGINE ERROR] Pipeline failed: {e}")
        import traceback

        traceback.print_exc()
        return {"status": "error", "message": str(e), "threat_level": "UNKNOWN"}
    finally:
        if cleaned_file and os.path.exists(cleaned_file):
            os.remove(cleaned_file)


def assess_threat(text):
    """
    Rule-based threat assessment.
    """
    text_upper = text.upper()

    threat_keywords = {
        "HIGH": [
            "ATTACK",
            "BOMB",
            "EXPLOSION",
            "WEAPON",
            "KILL",
            "SHOOT",
            "ENEMY",
            "AMBUSH",
            "FIRE",
            "MISSILE",
        ],
        "MEDIUM": [
            "MOVEMENT",
            "SECTOR",
            "NORTH",
            "SOUTH",
            "EAST",
            "WEST",
            "PATROL",
            "VEHICLE",
            "CROSSING",
            "BORDER",
        ],
        "LOW": ["HELLO", "FOOD", "WATER", "SUPPLIES", "WEATHER", "ROAD", "VILLAGE"],
    }

    detected_entities = []
    level = "LOW"

    for word in threat_keywords["HIGH"]:
        if word in text_upper:
            level = "HIGH"
            detected_entities.append(word)

    if level != "HIGH":
        for word in threat_keywords["MEDIUM"]:
            if word in text_upper:
                level = "MEDIUM"
                detected_entities.append(word)

    return {"level": level, "entities": list(set(detected_entities))}
