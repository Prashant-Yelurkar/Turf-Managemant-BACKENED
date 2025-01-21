import mongoose from "mongoose";
const Schema = mongoose.Schema;
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: false,
      unique: false,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Customer", "Admin"],
      default: "Customer",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
