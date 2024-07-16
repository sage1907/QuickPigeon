import jwt from "jsonwebtoken";

// Generate Token
export const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_KEY, { expiresIn: "3d" });
};

// Verify Token
export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_KEY, (err, decoded) => {
        if (err) {
            return false;
        } else {
            return decoded;
        }
    });
};

// Get Token From Header
export const getTokenFromHeader = (req) => {
    const token = req?.headers?.authorization?.split(" ")[1];
    if (token === undefined) {
        return null;
    } else {
        return token;
    }
};