import express from 'express'
const router=express.Router();
import { createBooking,getBookings,cancelBooking } from '../Controllers/bookingController.js';



router.post("/bookings", createBooking);    // Create booking
router.get("/bookings", getBookings);      // Get all bookings
router.delete("/bookings/:id", cancelBooking); // Cancel booking



export default router