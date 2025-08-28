import { Booking } from "../Models/Booking.js";
import { Vehicle } from "../Models/Vehicle.js";
import {calculateRideDuration} from '../utils/rideDuration.js'


// add vehicles
export  const addVehicles=async(req ,res)=>{
try {
    const {name,capacityKg,tyres}=req.body
     if (!name || !capacityKg || !tyres) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const vehicle= await Vehicle.create({name,capacityKg,tyres})
      res.status(201).json({message:'vehicle added succesfully',vehicle});
    




} catch (error) {
    res.status(500).json({ message: "Server error", error });
    
}
}

// get availble vehicles

export const getAvailableVehicles = async (req, res) => {
  try {
    const { capacityRequired, fromPincode, toPincode, startTime } = req.query;

    // ✅ Step 1: Check if all query parameters are provided
    if (!capacityRequired || !fromPincode || !toPincode || !startTime) {
      return res.status(400).json({ message: "Please provide all required query parameters." });
    }

    // ✅ Step 2: Calculate ride duration and time window
    const rideHours = calculateRideDuration(fromPincode, toPincode); // e.g., 2 hours
    const start = new Date(startTime); // ride start time 
    const end = new Date(start.getTime() + rideHours * 60 * 60 * 1000); // get time convert into milisecond

    // ✅ Step 3: Get all vehicles that can carry the required load
    const vehicles = await Vehicle.find({ capacityKg: { $gte: Number(capacityRequired) } });

    // ✅ Step 4: Filter out vehicles that are already booked
    const availableVehicles = [];
    for (const vehicle of vehicles) {
      const isBooked = await Booking.findOne({
        vehicleId: vehicle._id,
        $or: [
          { startTime: { $lt: end } },  // booking overlaps with requested time
          { endTime: { $gt: start } }
        ]
      });

      if (!isBooked) {
        availableVehicles.push({
          ...vehicle.toObject(),
          estimatedRideDurationHours: rideHours
        });
      }
    }

    // ✅ Step 5: Send response
    res.status(200).json(availableVehicles);

  } catch (error) {
    res.status(500).json({ message: "Something went wrong while fetching vehicles", error: error.message });
  }
};
