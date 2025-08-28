import express from "express";
import { createCustomer, getCustomers, getCustomerById } from "../Controllers/customerController.js";

const router = express.Router();

router.post("/", createCustomer);   // POST /api/customers
router.get("/", getCustomers);      // GET /api/customers
router.get("/:id", getCustomerById); // GET /api/customers/:id

export default router;