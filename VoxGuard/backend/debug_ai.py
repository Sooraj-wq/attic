
import os
import numpy as np
import soundfile as sf
from ai_engine import analyze_audio

# Create a dummy audio file
file_path = "test_audio.wav"
sr = 44100
duration = 1.0  # seconds
audio_data = np.random.uniform(-1, 1, int(sr * duration))
sf.write(file_path, audio_data, sr)

print(f"Created dummy file: {file_path}")

try:
    print("Attempting to analyze audio...")
    result = analyze_audio(file_path)
    print("Success:", result)
except Exception as e:
    print("Error encountered:")
    import traceback
    traceback.print_exc()
finally:
    if os.path.exists(file_path):
        os.remove(file_path)
