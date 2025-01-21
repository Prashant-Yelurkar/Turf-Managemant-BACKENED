// /utils/timeSlotGenerator.js

import moment from 'moment';
import Turf from '../models/turf.model';
import TimeSlot from '../models/timeSlot.model';

export const createTimeSlotsForGround = async (turfId, groundType, date) => {
    try {
        const turf = await Turf.findById(turfId);
        if (!turf) {
            throw new Error('Turf not found!');
        }

        const ground = turf.grounds.find(g => g.ground_type === groundType);
        if (!ground) {
            throw new Error('Ground type not found!');
        }

        const openingTime = moment(turf.opening_time, 'hh:mm A');
        const closingTime = moment(turf.closing_time, 'hh:mm A');

        let currentTime = openingTime;
        const timeSlots = [];

        while (currentTime.isBefore(closingTime)) {
            const nextTime = moment(currentTime).add(1, 'hour');
            const newTimeSlot = new TimeSlot({
                start_time: currentTime.format('hh:mm A'),
                end_time: nextTime.format('hh:mm A'),
                available: true,
                ground_type: groundType,
                date,
            });

            await newTimeSlot.save();
            timeSlots.push(newTimeSlot);

            currentTime = nextTime;
        }

        ground.time_slots.push(...timeSlots.map(slot => slot._id));

        await turf.save();
        console.log('Time slots added successfully!');
    } catch (error) {
        console.error('Error adding time slots:', error.message);
    }
};
