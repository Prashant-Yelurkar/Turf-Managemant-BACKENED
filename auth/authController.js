import jwt from "jsonwebtoken";

const generateAuthToken = (data) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;
  const token = jwt.sign(data, jwtSecretKey, { expiresIn: "10d" });
  return token;
};

const validateAuthToken = (token) => {
  const jwtSecretKey = process.env.JWT_SECRET_KEY;

  try {
    const decoded = jwt.verify(token, jwtSecretKey);
    return decoded;
  } catch (error) {
    console.log(`Error! ${error.name}`);
    return null;
  }
};

export { generateAuthToken, validateAuthToken };
