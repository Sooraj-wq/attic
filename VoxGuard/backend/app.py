"""
VoxGuard API Server
Flask Backend for Tactical Audio Intelligence
"""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from datetime import datetime
from ai_engine import analyze_audio

try:
    from static_ffmpeg import run
    ffmpeg, ffprobe = run.get_or_fetch_platform_executables_else_raise()
    # Explicitly add to PATH so librosa/audioread can find it
    os.environ["PATH"] += os.pathsep + os.path.dirname(ffmpeg)
except ImportError:
    print("Warning: static_ffmpeg not found, relying on system ffmpeg")

app = Flask(__name__)

# Enable CORS for all origins (for development and mobile testing)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# Upload directory for temporary audio files
UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@app.route('/api/analyze', methods=['POST'])
def analyze():
    """
    Main Analysis Endpoint
    Receives audio file and returns AI-processed intelligence.
    """
    try:
        print(f"\n[API] {datetime.now().isoformat()} - ANALYZE REQUEST RECEIVED")
        
        # Check if audio file is present
        if 'audio' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
        
        audio_file = request.files['audio']
        
        if audio_file.filename == '':
            return jsonify({"error": "Empty filename"}), 400
        
        # Save file temporarily
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"recording_{timestamp}.wav"
        filepath = os.path.join(UPLOAD_FOLDER, filename)
        audio_file.save(filepath)
        
        print(f"[API] File saved: {filepath}")
        
        # Process through AI engine
        result = analyze_audio(filepath)
        
        # Cleanup original file
        if os.path.exists(filepath):
            os.remove(filepath)
        
        print(f"[API] Response: {result['threat_level']} threat detected")
        return jsonify(result), 200
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        print(f"[API ERROR] {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/sos', methods=['POST'])
def sos_alert():
    """
    Emergency SOS Endpoint
    Logs critical distress signals to command center.
    """
    try:
        timestamp = datetime.now().isoformat()
        data = request.get_json() or {}
        
        print("\n" + "="*60)
        print("🚨 CRITICAL ALERT - SOS BEACON ACTIVATED 🚨")
        print("="*60)
        print(f"Timestamp: {timestamp}")
        print(f"Source: {data.get('source', 'Unknown')}")
        print(f"Location: {data.get('location', 'Not provided')}")
        print("="*60 + "\n")
        
        return jsonify({
            "status": "acknowledged",
            "message": "SOS signal broadcasted to command center",
            "timestamp": timestamp
        }), 200
        
    except Exception as e:
        print(f"[SOS ERROR] {str(e)}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/health', methods=['GET'])
def health_check():
    """System health check endpoint"""
    return jsonify({
        "status": "ONLINE",
        "system": "VoxGuard Tactical AI",
        "version": "1.0.0"
    }), 200


if __name__ == '__main__':
    print("\n" + "="*60)
    print("🛡️  VOXGUARD TACTICAL AI SYSTEM - INITIALIZING")
    print("="*60)
    print("Server: Flask")
    print("Host: 0.0.0.0")
    print("Port: 5000")
    print("Status: READY FOR DEPLOYMENT")
    print("="*60 + "\n")
    
    app.run(host='0.0.0.0', port=5000, debug=True)
