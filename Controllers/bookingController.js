import { Vehicle } from "../Models/Vehicle.js";
import { Booking } from "../Models/Booking.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { vehicleId, fromPincode, toPincode, startTime, endTime, customerId } = req.body;

    if (!vehicleId || !fromPincode || !toPincode || !startTime || !endTime ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    const start = new Date(startTime);
    const end = new Date(endTime);

    // Correct conflict check: overlap occurs if start < existing.endTime AND end > existing.startTime
    const conflict = await Booking.findOne({
      vehicleId,
      startTime: { $lt: end },
      endTime: { $gt: start }
    });

    if (conflict) {
      return res.status(409).json({ message: "Vehicle already booked in this time slot" });
    }

    const booking = new Booking({
      vehicleId,
      fromPincode,
      toPincode,
      startTime: start,
      endTime: end,
      customerId
    });

    await booking.save();
    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

// Get all bookings
export const getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate("vehicleId");
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { id } = req.params;

    const booking = await Booking.findById(id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    await booking.deleteOne();
    res.json({ success: true, message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};
