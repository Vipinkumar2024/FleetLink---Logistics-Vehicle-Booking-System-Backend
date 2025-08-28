import express from 'express'
const router=express.Router();
import { addVehicles,getAvailableVehicles } from '../Controllers/vehicleController.js';

// add vehicles
router.post("/vehicles", addVehicles);


// Get Available Vehicles
router.get("/vehicles/available", getAvailableVehicles);


export default router