// models/Booking.js

import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    turf_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Turf', required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    status: { type: String, enum: ['confirmed', 'canceled'], default: 'confirmed' },
});

export default mongoose.model('Booking', BookingSchema);
