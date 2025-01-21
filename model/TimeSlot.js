import mongoose from "mongoose";

const timeSlotSchema = new mongoose.Schema(
    {
        turfId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Turf", // Reference to the Turf collection
            required: true,
        },
        date: {
            type: String, // Store date in YYYY-MM-DD format
            required: true,
        },
        timeSlot: {
            type: String, // e.g., '09:00-10:00'
            required: true,
        },
        available: {
            type: Boolean,
            default: true, // True by default, i.e., slot is available
        },
    },
    { timestamps: true }
);

const TimeSlot = mongoose.model("TimeSlot", timeSlotSchema);

export default TimeSlot;
