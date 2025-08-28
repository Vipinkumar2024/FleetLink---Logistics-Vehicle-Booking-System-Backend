import { Customer } from "../Models/customer.js";

// @desc    Create a new customer
// @route   POST /api/customers
export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    // simple validation
    if (!name || !email || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // check if email already exists
    const existing = await Customer.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Customer with this email already exists" });
    }

    const customer = await Customer.create({ name, email, phone });

    res.status(201).json({
      message: "Customer created successfully",
      customer,
    });
  } catch (err) {
    console.error("Error creating customer:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Get all customers
// @route   GET /api/customers
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc    Get single customer by ID
// @route   GET /api/customers/:id
export const getCustomerById = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
