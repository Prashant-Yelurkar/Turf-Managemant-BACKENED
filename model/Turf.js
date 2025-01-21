// models/Turf.js

import mongoose from 'mongoose';

const SlotSchema = new mongoose.Schema({
    time: { type: String, required: true },
    available: { type: Boolean, default: true },
});

const TimeSlotSchema = new mongoose.Schema({
    date: { type: String, required: true },
    slots: [SlotSchema],
});

const TurfSchema = new mongoose.Schema({
    name: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    opening_time: { type: String, required: true },
    closing_time: { type: String, required: true },
    ground_type: { type: String, required: true },
    price_per_hour: { type: Number, required: true },
    time_slots: [TimeSlotSchema],
});

export default mongoose.model('Turf', TurfSchema);
