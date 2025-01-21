import express from "express";
import authenticateToken from "./authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, (req, res) => {
  return res.send({
    success: true,
    message: "Token is valid",
    user: { email: req.user.email, role: req.user.role },
  });
});

export default router;
