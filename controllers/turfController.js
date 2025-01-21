// controllers/turfController.js

import Turf from '../model/Turf.js';
import Booking from '../model/Booking.js'

// Helper function to increment time by 1 hour
const incrementTime = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const newHours = (hours + 1) % 24;
    return `${newHours < 10 ? '0' : ''}${newHours}:${minutes < 10 ? '0' : ''}${minutes}`;
};

// Function to generate time slots based on opening and closing time
const generateTimeSlots = (opening_time, closing_time) => {
    const slots = [];
    let currentTime = opening_time;
    let closingTime = closing_time;

    // If opening time is equal to closing time, treat it as a 1-hour duration
    if (opening_time === closing_time) {
        closingTime = incrementTime(opening_time); // Make closing time 1 hour later
    }

    // Loop to generate time slots until we reach closing time
    while (currentTime !== closingTime) {
        const nextTime = incrementTime(currentTime); // Increment to the next time slot

        // Push the slot in the format "09:00-10:00"
        slots.push({
            time: `${currentTime}-${nextTime}`,
            available: true, // Initially, all slots are available
        });

        // Move to the next time slot
        currentTime = nextTime;
    }

    return slots;
};

// Function to add a turf
const AddTurf = async (req, res) => {
    const { name, address, city, state, zipCode, opening_time, closing_time, ground_type, price_per_hour } = req.body;

    try {
        const turf = new Turf({
            name,
            address,
            city,
            state,
            zipCode,
            opening_time,
            closing_time,
            ground_type,
            price_per_hour,
            time_slots: [], // Initialize time_slots as an empty array
        });

        // Generate time slots based on opening and closing time
        const timeSlots = generateTimeSlots(opening_time, closing_time);

        // Add the generated time slots for the current date
        turf.time_slots.push({
            date: new Date().toISOString().split('T')[0],  // Store today's date in 'YYYY-MM-DD' format
            slots: timeSlots,
        });

        // Save the turf with the time slots
        await turf.save();
        res.status(201).json({ message: 'Turf added successfully', turf });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding turf', error: error.message });
    }
};

// Function to get all turfs
const getAllTurfs = async (req, res) => {
    try {
        const turfs = await Turf.find();
        if (!turfs || turfs.length === 0) {
            return res.status(404).json({ message: "No turfs found" });
        }
        res.status(200).json({ data: turfs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching turfs", error: error.message });
    }
};

// Function to get available time slots for a specific turf and date
// Function to get available time slots for a specific turf and date
const getAvailableSlots = async (req, res) => {
    try {
        const { turfId, date } = req.body;

        // Find the turf by ID
        const turf = await Turf.findById(turfId);
        if (!turf) {
            return res.status(404).json({ message: "Turf not found" });
        }

        // Check if the time slots for the selected date exist
        let timeSlotsForDate = turf.time_slots.find((slot) => slot.date === date);

        if (!timeSlotsForDate) {
            // If no slots for the selected date, generate the slots for that date
            const generatedSlots = generateTimeSlots(turf.opening_time, turf.closing_time);

            // Add the new time slot entry for the selected date
            timeSlotsForDate = {
                date,
                slots: generatedSlots
            };

            // Push the new date and its slots to the turf's time_slots array
            turf.time_slots.push(timeSlotsForDate);

            // Save the updated turf with the new time slots
            await turf.save();

            console.log(`New time slots added for date: ${date}`);
        }

        // Filter the available slots
        const availableSlots = timeSlotsForDate.slots;

        // Return the available slots for the selected date
        res.status(200).json({ data: availableSlots });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching available slots", error: error.message });
    }
};


// Function to book a slot
const bookSlot = async (req, res) => {
    const { turfId, date, time, userId } = req.body;

    console.log({ turfId, date, time, userId });

    try {
        const turf = await Turf.findById(turfId);
        if (!turf) {
            return res.status(404).json({ message: "Turf not found" });
        }


        const selectedSlot = turf.time_slots
            .find(t => t.date === date)
            ?.slots.find((s) => s.time == time);

        console.log(turf.time_slots
            .find(t => t.date === date));

        if (!selectedSlot) {
            return res.status(400).json({
                data: { message: "Selected slot is not available" }
            });
        }

        // Create a booking record
        console.log(req.user);

        const booking = new Booking({
            user_id: req.user.userId,
            turf_id: turfId,
            date,
            time,
            status: 'confirmed',
        });

        await booking.save();

        // Mark the slot as unavailable
        selectedSlot.available = false;
        console.log(selectedSlot);

        // Save the turf document with the updated slot
        await turf.save();

        res.status(201).json({ data: { message: "Booking successful we will contact You", booking } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ data: { message: "Error booking the slot", error: error.message } });
    }
};



export default { AddTurf, getAllTurfs, getAvailableSlots, bookSlot };
