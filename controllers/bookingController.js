import Booking from "../model/Booking.js";
import Turf from "../model/Turf.js";

// Controller to handle booking a turf
const bookTurf = async (req, res) => {
    const { userId, turfId, date, time_slot } = req.body; // Get the necessary data

    try {
        // Find the turf
        const turf = await Turf.findById(turfId);

        if (!turf) {
            return res.status(404).json({ message: "Turf not found" });
        }

        // Check if the selected date exists and the time slot is available
        const timeSlot = turf.time_slots.find((slot) => slot.date === date);

        if (!timeSlot) {
            return res.status(400).json({ message: "No slots available for this date" });
        }

        const isAvailable = timeSlot.slots.some((slot) => slot.time === time_slot && slot.available);

        if (!isAvailable) {
            return res.status(400).json({ message: "Time slot not available" });
        }

        // Create a new booking
        const booking = new Booking({
            user: userId,
            turf: turfId,
            date,
            time_slot,
            status: 'booked',
        });

        // Save the booking to the database
        await booking.save();

        // Mark the time slot as unavailable
        turf.time_slots.forEach((slot) => {
            if (slot.date === date) {
                slot.slots.forEach((slotItem) => {
                    if (slotItem.time === time_slot) {
                        slotItem.available = false; // Mark the time slot as unavailable
                    }
                });
            }
        });

        // Save updated turf availability
        await turf.save();

        res.status(201).json({ message: 'Turf booked successfully', booking });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error booking turf', error: error.message });
    }
};

export { bookTurf };
