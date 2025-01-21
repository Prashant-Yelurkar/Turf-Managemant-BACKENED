import express from "express";
import turfController from "../controllers/turfController.js"
import checkAdmin from '../auth/adminMiddleware.js';
import Booking from "../model/Booking.js";
import User from "../model/User.js";

const router = express.Router();


router.post("/", checkAdmin, turfController.AddTurf);
router.get("/", turfController.getAllTurfs);
router.post("/avilabel-slot", turfController.getAvailableSlots);
router.post("/book", turfController.bookSlot);
router.get('/bookings', checkAdmin, async (req, res) => {
    try {
        const bookings = await Booking.find();

        console.log('Bookings without populate:', bookings); // Logs the raw bookings data

        const populatedBookings = await Booking.find()
            .populate('user_id', 'email');


        console.log('Bookings with populated user data:', populatedBookings); // Logs populated data

        return res.status(200).json({ data: populatedBookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ message: 'Error fetching bookings' });
    }
});

router.get('/users', checkAdmin, async (req, res) => {
    try {
        // Aggregate users with their booking count (without fetching booking details)
        const users = await User.aggregate([
            {
                $lookup: {
                    from: 'bookings',          // The collection to join
                    localField: '_id',          // Field in User collection
                    foreignField: 'user_id',    // Field in Booking collection
                    as: 'bookings'             // The result of the join will be stored in this field
                }
            },
            {
                $addFields: {
                    bookingCount: { $size: '$bookings' }, // Add a new field with the number of bookings
                }
            },
            {
                $project: {
                    name: 1,               // Include the name field
                    email: 1,              // Include the email field
                    bookingCount: 1,       // Include the bookingCount field
                    _id: 1                 // Include the _id field (optional)
                }
            }
        ]);

        console.log('Users with booking counts:', users); // Logs the result

        return res.status(200).json({ data: users }); // Return users with booking count
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users' });
    }
});


export default router;
