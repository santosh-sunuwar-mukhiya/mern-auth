import jwt from 'jsonwebtoken';

const userAuth = (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
        return res.status(401).json({success:false, message:"Unauthorized - no token provided!"})
    }
    try { 

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            return res.status(401).json({ success: false, message: "Unauthorized - invalid token!" });
        }

        req.userId = decode.userId;
        next();

    } catch (error) {
        res.status(500).json({success:false, message:error.message})
    }
}

export default userAuth;