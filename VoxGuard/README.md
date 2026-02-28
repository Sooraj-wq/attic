# VoxGuard - Tactical Intelligence System

## 🛡️ **Mission Brief**
VoxGuard is a defense-grade audio intelligence platform for real-time speech translation and threat assessment. Built with military-spec UI design and AI-powered analysis.

---

## **📁 Project Structure**
```
VoxGuard/
├── backend/          # Python Flask API Server
│   ├── app.py        # Main API routes
│   ├── ai_engine.py  # Audio processing & AI logic
│   └── requirements.txt
└── frontend/         # React + Vite + Capacitor
    ├── src/
    │   ├── App.jsx              # Main dashboard
    │   ├── index.css            # Tactical UI theme
    │   ├── config.js            # API configuration
    │   ├── hooks/
    │   │   └── useAudioRecorder.js
    │   └── components/
    │       └── SOSBeacon.jsx
    └── android/      # Native Android platform (Capacitor)
```

---

## **🚀 Deployment Instructions**

### **STEP 1: Backend Setup**
```bash
cd backend
pip install -r requirements.txt
python app.py
```
✅ **Backend will run on:** `http://0.0.0.0:5000`

### **STEP 2: Frontend Setup (Laptop Demo)**
```bash
cd frontend
npm install
npm run dev
```
✅ **Frontend will run on:** `http://localhost:5173`

### **STEP 3: Android Preview (Capacitor)**
```bash
cd frontend
npm run build          # Build production assets
npx cap sync           # Sync to Android platform
npx cap open android   # Open in Android Studio
```

---

## **📱 Mobile Testing Instructions**

### **For Mobile Device Testing:**
1. **Find your laptop's IP address:**
   ```bash
   ip addr show | grep inet
   # Example output: 192.168.1.5
   ```

2. **Update `frontend/src/config.js`:**
   ```javascript
   export const API_BASE_URL = 'http://192.168.1.5:5000';
   ```

3. **Ensure devices are on the same network**

4. **Rebuild and sync:**
   ```bash
   npm run build
   npx cap sync
   ```

---

## **🎯 Key Features**

### **Backend (Python)**
- ✅ Audio noise reduction (`noisereduce` + `librosa`)
- ✅ AI placeholder for Whisper integration
- ✅ REST API with CORS enabled
- ✅ SOS emergency endpoint

### **Frontend (React)**
- ✅ Tactical military UI (no rounded corners, HUD borders)
- ✅ Push-to-Talk audio recording
- ✅ Real-time status terminal
- ✅ SOS distress beacon with visual alerts
- ✅ Threat level color-coding (HIGH/MEDIUM/LOW)

---

## **⚠️ TEAMMATE TODO**
**File:** `backend/ai_engine.py` → `analyze_audio()` function

**Current:** Mock AI response (1.5s delay)

**Replace with:**
```python
# Load Whisper model
model = whisper.load_model("base")
result = model.transcribe(cleaned_file)
original_text = result["text"]

# Add translation model here
translated_text = translate_to_english(original_text)

# Add threat detection logic
threat_level = assess_threat(translated_text)
```

---

## **🎨 UI Theme Variables**
All styling uses CSS variables (no Tailwind):
- **Background:** `#0b0c10` (Deep Slate Black)
- **Surface:** `#1f2833` (Gunmetal Grey)
- **Primary:** `#45a29e` (Terminal Green)
- **Alert:** `#ff0033` (Critical Red)

---

## **🔧 Tech Stack**
- **Backend:** Python 3.x, Flask, Librosa, NumPy
- **Frontend:** React 18, Vite 7, Capacitor
- **Audio:** MediaRecorder API (Browser)
- **Platform:** Android (via Capacitor)

---

## **📝 Development Notes**
- Backend must run on `0.0.0.0` for network access
- Frontend dev server: `npm run dev`
- Production build: `npm run build`
- Audio format: WebM → WAV conversion handled server-side

---

## **🛡️ Classification**
**PROJECT M.I.T.R.A // VoxGuard v1.0**  
**Status:** OPERATIONAL  
**Clearance:** RESTRICTED
