require('dotenv').config(); 
const express = require("express");
const mongoose = require('mongoose');
const path = require('path');
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 4000; 

const mongoDBURL = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/mydemoDB';

app.use(express.static('./public'));

mongoose.connect(mongoDBURL)
    .then(() => {
        console.log("Connection Successful");
        isConnected = true;
    })
    .catch((err) => {
        console.error("Connection Error:", err);
        console.log("Falling back to in-memory database.");
        isConnected = false;
    });

    const rideSchema = new mongoose.Schema({
        uid: String,
        sct: String,
        fl: String,
        dl: String,
        tel: String,
    });

    const Ride = mongoose.model('Ride', rideSchema);

    // In-memory fallback
    let isConnected = false;
    let localRides = [];


app.listen(PORT, () => {
    console.log(`Server started at port ${PORT}`);
});

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname,'index.html'));
});


app.post('/findride', async (req, res) => {
    const { sct, fl, dl, tel, uid } = req.body;

    if (!isConnected) {
        console.log('Using in-memory DB for findride');
        const existingRide = localRides.find(r => r.sct === sct && r.fl === fl && r.dl === dl);
        if (existingRide) {
            console.log('ride details found (in-memory)');
            return res.status(200).json({ message: 'Ride details found!' });
        } else {
            localRides.push({ uid, sct, fl, dl, tel });
            console.log('ride details added (in-memory)');
            return res.status(201).json({ message: 'Ride details added!' });
        }
    }

    try {
        const existingRide = await Ride.findOne({ sct, fl, dl });

        if (existingRide) {
            console.log('ride details found');
            return res.status(200).json({ message: 'Ride details found!' });
        } else {
            const newRide = new Ride({ uid, sct, fl, dl, tel });
            await newRide.save();
            console.log('ride details added');
            return res.status(201).json({ message: 'Ride details added!' });
        }
    } catch (error) {
        console.error("Error while handling the ride request:", error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

app.get('/allrides', async (req, res) => {
    if (!isConnected) {
        console.log('Using in-memory DB for allrides');
        return res.status(200).json({ message: 'Rides fetched successfully', data: localRides });
    }

    try {
        const allRides = await Ride.find();

        if (!allRides || allRides.length === 0) {
            return res.status(200).json({ message: 'No rides found', data: [] });
        }

        return res.status(200).json({ message: 'Rides fetched successfully', data: allRides });
    } catch (error) {
        console.error("Error while fetching rides:", error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});

app.delete('/deleteride/:uid', async (req, res) => {
    const { uid } = req.params;

    if (!isConnected) {
        console.log('Using in-memory DB for deleteride');
        const initialLength = localRides.length;
        localRides = localRides.filter(r => r.uid !== uid);
        
        if (localRides.length === initialLength) {
            return res.status(404).json({ message: 'Ride not found' });
        }
        return res.status(200).json({ message: 'Ride deleted successfully', data: { uid } });
    }

    try {
        const deletedRide = await Ride.findOneAndDelete({ uid });

        if (!deletedRide) {
            return res.status(404).json({ message: 'Ride not found' });
        }

        return res.status(200).json({ message: 'Ride deleted successfully', data: deletedRide });
    } catch (error) {
        console.error("Error while deleting the ride:", error);
        return res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
});