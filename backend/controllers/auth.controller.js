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
        const userId = req.userId;
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User Not Found!"
            });
        }

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
    const userId = req.userId;
    const { otp } = req.body;
    if (!userId || !otp) {
        return res.status(400).json({ success: false, message: "Missing Details!" });
    }

    try { 
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: "User Not Found!" });
        }

        if (user.verifyOtp !== otp || user.verifyOtp === '' || user.verifyOtpExpireAt < Date.now()) {
            return res.status(400).json({ success: false, message: "Invalid OTP or Expired OTP." });
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpireAt = 0;

        await user.save();

        res.status(200).json({ success: true, message: "Email Verified Successfully!" });
        
    } catch (error) {
        res.status(500).json({success:false, message:error.message})
    }
}

export const checkAuth = async (req, res) => {
    try {
        return res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

// Password reset otp
export const resetOtp = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ success: false, message: 'Email is Required!' });
    }

    try { 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User Not Found!' });
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetOtp = otp;
        user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;

        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text:`Reset Your Password with OTP:${otp}. OTP Expires on 15 Minutes.`
        }

        await transporter.sendMail(mailOption);

        res.status(200).json({ success: true, message: 'Password Reset OTP Sent Successfully!' });
    } catch (error) {
        res.status(500).json({success:false, message:error.message})
    }
}

// Reset password
export const resetPassword = async (req, res) => {
    const { otp, email, password } = req.body;
    if (!otp || !email || !password) {
        return res.status(400).json({ success: false, message: 'Email, OTP, and New Password are Required!' });
    }
    try { 
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User Not Found!' });
        }

        if (user.resetOtp === '' || user.resetOtpExpireAt < Date.now() || user.resetOtp !== otp) {
            return res.status(400).json({success:false, message:'Invalid or Expired OTP.'})
        }

        const newPassword = await bcrypt.hash(password, 10);
        user.password = newPassword;
        user.resetOtp = '';
        user.resetOtpExpireAt = 0;
        await user.save();

        const mailOption = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset Successfully.',
            text:`Your Password has been Reset Successfully.}`
        }

        await transporter.sendMail(mailOption);

        res.status(200).json({ success: true, message: 'Password Reset Successfully!' });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

