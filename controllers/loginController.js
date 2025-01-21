import { generateAuthToken } from "../auth/authController.js";
import User from "../model/user.js";
import bcrypt from "bcrypt";

const loginController = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).send({
        success: false,
        message: "All fields are required"
      });
    }

    const user = await User.findOne({ email: username });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name: '',
        email: username,
        password: hashedPassword,
      });

      const result = await newUser.save();

      if (result) {

        const token = generateAuthToken({
          role: newUser.role,
          userId: newUser._id,
        });

        return res.status(201).send({
          data: {
            success: true,
            token: token,
          }
        });
      }
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).send({
        data: {
          success: false,
          message: "Username or Password Mismatch",
        }
      });
    }


    const token = generateAuthToken({
      role: user.role,
      userId: user._id,
    });

    return res.status(201).send({
      data: {
        success: true,
        token: token,
      }
    });

  } catch (error) {
    console.error(error);
    return res.status(500).send({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
};

export default loginController;
