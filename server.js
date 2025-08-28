// import express from 'express'
// import mongoose from 'mongoose'
// import cors from 'cors'

// // all Routers
// import VehiclesRoutes from './Routes/vehicles.js'
// import BookingRoutes from './Routes/booking.js'
// import customerRoutes from './Routes/customer.js'
// const app=express()
// app.use(express.json())// user to parse incomming json



// mongoose.connect("mongodb+srv://vipindubey2032001_db_user:GvX2uhtfLHnBCRWm@cluster0.yovf1oc.mongodb.net/",{
//     dbName:'Vehicle_Booking_System'
// }).then(()=>console.log(`mongoosedb connected succesfully`)).catch((err)=>console.log(err))


// app.use(cors({
//     origin:true,
//     methods:["GET","POST","PUT","DELETE"],
//     credentials:true
// }))

// // vehicles all Routes
// app.use('/api',VehiclesRoutes)
// // booking Routes
// app.use('/api',BookingRoutes)
// // cutomer Routes
// app.use('/api',customerRoutes)


// const port=6000
// app.listen(port,()=>console.log(`server listening on  ${port}`))
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
app.use(express.json()); // parse incoming JSON

// Routers
import VehiclesRoutes from './Routes/vehicles.js';
import BookingRoutes from './Routes/booking.js';


// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
    dbName: process.env.DB_NAME,
})
.then(() => console.log(' MongoDB connected successfully'))
.catch((err) => console.error(' MongoDB connection error:', err));

// CORS setup
app.use(cors({
    origin: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

// API Routes
app.use('/api', VehiclesRoutes);
app.use('/api', BookingRoutes);


// Server listen
const port = process.env.PORT || 5000;
app.listen(port, () => console.log(` Server listening on port ${port}`));
