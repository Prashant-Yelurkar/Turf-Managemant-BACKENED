import express from "express";
import { bookTurf } from "../controllers/bookingController.js";


const router = express.Router();


router.post("/", bookTurf);

export default router;
