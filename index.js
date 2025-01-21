import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

const app = express();

import connectDB from "./db/connect.js";

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


import loginRoutes from "./routes/loginRoutes.js";
import authRoutes from "./auth/authRoutes.js";
import authenticateToken from "./auth/authMiddleware.js";
import TurfRoute from "./routes/turfRoutes.js";
import BookingRoute from './routes/bookingRoutes.js'

app.use("/verify-token", authRoutes);
app.use("/auth", loginRoutes);
app.use("/turf", authenticateToken, TurfRoute);
app.use("/book", authenticateToken, BookingRoute);

app.use("/", (req, res) => {
  res.send("Hello hiisdss!");
});
const connection = async () => {
  try {
    connectDB(process.env.MONGODB_URI)
      .then(() =>
        app.listen(3001, function () {
          console.log("Example app listening on port 3001!");
        })
      )
      .catch((error) => console.log(error));
  } catch (error) {
    console.log(error);
  }
};

connection();
