import { Booking } from "../Models/Booking.js";
import { Vehicle } from "../Models/Vehicle.js";
import { calculateRideDuration } from '../utils/rideDuration.js'

// Add vehicles
export const addVehicles = async (req, res) => {
  try {
    const { name, capacityKg, tyres } = req.body;
    if (!name || !capacityKg || !tyres) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const vehicle = await Vehicle.create({ name, capacityKg, tyres });
    res.status(201).json({ message: 'Vehicle added successfully', vehicle });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get available vehicles
export const getAvailableVehicles = async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;

    if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
      return res.status(400).json({ message: "Please provide all required query parameters." });
    }

    const rideHours = calculateRideDuration(fromPincode, toPincode);
    const start = new Date(startTime);
    const end = new Date(start.getTime() + rideHours * 60 * 60 * 1000);

    // Find vehicles that meet capacity requirement
    const vehicles = await Vehicle.find({ capacityKg: { $gte: Number(capacityRequired) } });

    const availableVehicles = [];
    for (const vehicle of vehicles) {
      // Correct conflict check
      const conflict = await Booking.findOne({
        vehicleId: vehicle._id,
        startTime: { $lt: end },
        endTime: { $gt: start }
      });

      if (!conflict) {
        availableVehicles.push({
          ...vehicle.toObject(),
          estimatedRideDurationHours: rideHours
        });
      }
    }

    res.status(200).json(availableVehicles);

  } catch (error) {
    res.status(500).json({ message: "Something went wrong while fetching vehicles", error: error.message });
  }
};
