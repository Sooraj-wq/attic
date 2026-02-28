# QuickRide

> **Note:** This repository contains a simulative project developed for a hackathon by novice developers. It is not a fully functional production-ready application and is provided as a proof of concept only.

## Overview

QuickRide is a web-based ridesharing prototype that attempts to match passengers traveling on similar routes with the same vehicle type. The application computes distance between locations, estimates fare, stores booking data, and looks for matching rides in order to offer a rideshare discount.

When multiple passengers are matched for the same route and vehicle type, participants receive a 30% discount on the fare.

## Technology Stack

**Backend**
- Node.js with Express.js — REST API server
- MongoDB with Mongoose — persistent storage (in-memory fallback available for development)
- dotenv — environment configuration

**Frontend**
- HTML5, CSS3, JavaScript (ES6 modules)
- Tailwind CSS (CDN)
- LocalStorage for short-term client-side persistence

**External Services**
- OpenStreetMap Nominatim API — geocoding (address → coordinates)
- Browser Geolocation API — emergency location sharing

## Installation
### Prerequisites
 - Node.js (v14+)
 - npm
 - MongoDB (optional; required for persistent storage)

### Steps

1. Install dependencies:

```bash
npm install
```

2. (Optional) Start MongoDB service:

```bash
# Linux/macOS
sudo systemctl start mongod

# Or run mongod directly with a dbpath
mongod --dbpath ~/data/db

# Windows (PowerShell)
net start MongoDB
```

3. Create a `.env` file in the project root (optional):

```env
PORT=4000
MONGODB_URL=mongodb://127.0.0.1:27017/rideshare
```

4. Start the application:

```bash
npm start
```

Open the app at `http://localhost:4000`.

> If MongoDB is not running the server will automatically use an in-memory store; data will not persist between restarts.

## Usage

### Booking a Ride

1. Open the home page and enter a unique user ID.
2. Enter pickup and destination locations.
3. Select vehicle type and payment method.
4. Click **Order taxi now**.

The frontend will geocode the addresses, compute distance (Haversine), calculate fare (₹15/km), and submit the ride to the backend.

### Ride Matching

- The backend stores the submitted ride and the ride details page periodically queries `/allrides` to find matches.
- A match requires identical pickup, destination, and vehicle type, and a different user ID.
- When matches are found the displayed fare is reduced by 30% and the number of matched passengers is shown.

### Safety & Ride Management

- Users may save an emergency contact in the ride details page.
- Emergency alert simulates notifying the saved contact and shares the current location via a WhatsApp link.
- Active rides can be viewed on the **All Rides** page and deleted if required.

## API Endpoints

- `GET /` — Serve homepage
- `POST /findride` — Create or find an existing ride
- `GET /allrides` — Retrieve all active rides
- `DELETE /deleteride/:uid` — Delete ride by user ID

## Project Structure

```
├── app.js                 # Server entrypoint
├── index.html             # Booking UI
├── package.json
├── public/
│   ├── home.js            # Client booking logic
│   ├── haversine.js      # Distance calculation
│   ├── ride-details.html  # Ride details and matching UI
│   ├── all-rides.html     # View all active rides
│   └── aboutus.html
```

## Known Limitations

- Matching requires consistent textual location input; there is no fuzzy normalization ("New York" vs "NYC" may not match).
- The app uses the public Nominatim API which enforces rate limits.
- In-memory fallback does not persist data after restart.
- No authentication: user IDs are not validated; access controls are not implemented.
- Emergency/location features require HTTPS in production for full browser support.

## Testing the Matching Flow

To test locally, open two browser tabs and create two bookings with different user IDs but identical pickup, destination and vehicle type.

**Example input**

Tab 1:
```
User ID: alice
From: Times Square, New York
To: Central Park, New York
Vehicle: Sedan
```

Tab 2:
```
User ID: bob
From: Times Square, New York
To: Central Park, New York
Vehicle: Sedan
```

The second tab should detect the first booking as a matching ride and apply the rideshare discount.

## Future Improvements

- Add user authentication and role separation (driver/passenger)
- Real-time updates via WebSockets
- Location input autocomplete.
- Persistent ride history and analytics
- Payment gateway integration

## Contributors

- Sooraj
- Mareo

Built for D-Solve Dotslash Hackathon, College of Engineering Trivandrum.

## License

MIT
