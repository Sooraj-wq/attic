/**
 * VoxGuard Configuration
 * API Endpoint Management
 */

// CHANGE THIS TO YOUR LAPTOP IP (e.g., http://192.168.1.5:5000) FOR MOBILE TESTING
export const API_BASE_URL = 'http://localhost:5000';

// For Android/Mobile Testing:
// 1. Find your laptop's local IP: `ip addr` or `ifconfig`
// 2. Update API_BASE_URL to: http://YOUR_IP:5000
// 3. Ensure both devices are on the same network
// 4. Backend must run on 0.0.0.0 (not 127.0.0.1)

export const API_ENDPOINTS = {
  ANALYZE: `${API_BASE_URL}/api/analyze`,
  SOS: `${API_BASE_URL}/api/sos`,
  HEALTH: `${API_BASE_URL}/api/health`
};
