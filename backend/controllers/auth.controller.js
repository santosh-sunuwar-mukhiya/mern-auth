import bcrypt from 'bcryptjs'

import User from '../models/user.model.js'
import tokenAndCookie from '../utils/tokenAndCookie.js'
import transporter from '../config/nodemailer.js'

export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({success:false, message:'All the fields are requireds!'})
    }

    try {
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({success:false, message:'User Already Exist!'})
        }
        const hashedPassword = await bcrypt.hash(password, 10)
        const user = new User({ name, email, password: hashedPassword })
        await user.save();

        tokenAndCookie(res, user._id); //jwt 

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome Email',
            text:`Welcome to Login Auth website. your account has been created with email: ${email}`
        }

        await transporter.sendMail(mailOption)

        res.status(201).json(
            {
                success: true,
                message: "User Created Successfully!",
                user: {
                    ...user._doc,
                    password: undefined,
                },
            }
        );

    } catch (error) {
        res.status(500).json({success:false, message:error.message})
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({success:false, message:'Email and Password are required!'})
    }

    try { 
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({success:false, message:'Invalid Credentials!'})
        }
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            return res.status(400).json({success:false, message:'Invalid Credentials!'})
        }

        tokenAndCookie(res, user._id);
        await user.save();
        res.status(200).json({ success: true, message: "Logged In successfully!" })
        
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
}

export const logout = async (req, res) => {
    try { 
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ success: true, message: "Logout Successfully!" })
        
    } catch (error) {
        return res.json({success:false, message:error.message})
    }
}

export const sendVerifyOtp = async (req, res) => {
    try { 
        const { userId } = req.body;
        const user = await User.findById(userId);

        if (user.isAccountVerified) {
            return res.json({success:false, message:"Account Already Verified!"})
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.verifyOtp = otp;
        user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text:`Your OTP is ${otp}. Verify your account with OTP.`
        }

        await transporter.sendMail(mailOption)

        res.status(200).json({success:true, message:"OTP sent successfully."})

        await user.save();
    } catch (error) {
        res.status(500).json({success:false, message:error.message})
    }
}

export const verifyEmail = async (req, res) => {
    const { userId, otp } = req.body;
    if (!userId || otp) {
        return res.status(400).json({ success: false, message: "Missing Details!" });
    }

    try { 
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found!" });
        }

        if (user.verifyOtp !== otp || user.verifyOtp === '') {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "Expired OTP" });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        res.status(200).json({ success: true, message: "Email Verified Successfully!" });
        
    } catch (error) {
        res.json({success:false, message:error.message})
    }
}