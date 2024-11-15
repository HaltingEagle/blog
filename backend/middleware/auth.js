import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
    const {token} = req.headers;
    if(!token){
        return res.status(401).json({error: "Unauthorized No Token"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({error: "Unauthorized"});
    }
}