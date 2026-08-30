import {assets} from "../assets/assets.js";
import React, {useContext, useState} from "react";
import {useNavigate} from "react-router-dom";
import {AppContent} from "../context/AppContext.jsx";
import {toast} from "react-toastify";
import axios from "axios";

export default function ResetPassword() {
    const {backendUrl} = useContext(AppContent);
    axios.defaults.withCredentials = true;

    const [email, setEmail] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [otp, setOtp] = useState(0);
    const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);

    const inputRefs = React.useRef([]);

    const handleInput = (e, i) => {
        if(e.target.value.length > 0 && i < inputRefs.current.length - 1) {
            inputRefs.current[i + 1].focus()
        }
    }

    const handleKeyDown = (e, i) => {
        if (e.key === "Backspace" && e.target.value === "" && i > 0) {
            inputRefs.current[i - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();

        const paste = e.clipboardData
            .getData("text")
            .slice(0, 6);

        paste.split("").forEach((char, i) => {
            if (inputRefs.current[i]) {
                inputRefs.current[i].value = char;
            }
        });

        if (inputRefs.current[paste.length - 1]) {
            inputRefs.current[paste.length - 1].focus();
        }
    };
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try{
            const {data} = await axios.post(`${backendUrl}/api/auth/reset-otp`, {email});
            data.success ? toast.success(data.message) : toast.error(data.message);
            data.success && setIsEmailSent(true)
        }catch(err){
            toast.error(err.message)
        }
    }

    const handleOtp = (e) => {
        e.preventDefault();
        const otpArray = inputRefs.current.map(e => e.value);
        setOtp(otpArray.join(''));
        setIsOtpSubmitted(true);
    }

    const handleNewPassword = async (e) => {
        e.preventDefault();
        try{
            const {data} = await axios.post(`${backendUrl}/api/auth/reset-password`, {email, otp, newPassword});
            data.success ? toast.success(data.message) : toast.error(data.message);
            data.success && navigate('/login');
        }catch(err){
            toast.error(err.message)
        }
    }
    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
            <img onClick={()=> navigate('/')} src={assets.logo} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' alt={'logo'}/>

            {/*enter email address*/}
            {!isEmailSent &&
                <form id={'email-sent'} onSubmit={(e)=>handleEmailSubmit(e)} className={'bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'}>
                <h1 className={'text-white text-2xl font-semibold text-center mb-4'}>Reset Password</h1>
                <p className={'text-center mb-6 text-indigo-300'}>Enter your Registered Email Address.</p>
                <div className={'mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'}>
                    <img src={assets.mail_icon} alt={'Mail icon'} className='w-3 h-3'/>
                    <input
                        type={'email'} placeholder={'Email Id'}
                        className='bg-transparent outline-none text-white'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} required
                    />
                </div>
                <button type={'submit'} className={'w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'}>Submit</button>
            </form> }

            {/*otp input form*/}
            {!isOtpSubmitted && isEmailSent &&
                <form onSubmit={handleOtp} id={'reset-otp'} className={'bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'}>
                <h1 className={'text-white text-2xl font-semibold text-center mb-4'}>Reset Password OTP</h1>
                <p className={'text-center mb-6 text-indigo-300'}>Enter the 6 digit code sent to your email id.</p>
                <div className={'flex justify-between mb-8'} onPaste={handlePaste}>
                    {Array(6).fill(0).map((_, i) =>(
                        <input type={'text'} key={i} maxLength={1} required
                               className={'w-12 h-12 bg-[#333A53] text-white text-center text-xl rounded-md'}
                               ref={e => inputRefs.current[i] = e}
                               onChange={(e)=> handleInput(e, i)}
                               onKeyDown={(e)=>handleKeyDown(e, i)}
                        />
                    ))}
                </div>
                <button className={'w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'}>Submit</button>
            </form> }

            {/*new password form*/}
            {isOtpSubmitted && isEmailSent &&
                <form onSubmit={handleNewPassword} id={'reset-password'} className={'bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'}>
                <h1 className={'text-white text-2xl font-semibold text-center mb-4'}>New Password</h1>
                <p className={'text-center mb-6 text-indigo-300'}>Enter the new password below.</p>
                <div className={'mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'}>
                    <img src={assets.lock_icon} alt={'Lock icon'} className='w-3 h-3'/>
                    <input
                        type={'password'} placeholder={'Password'}
                        className='bg-transparent outline-none text-white'
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)} required
                    />
                </div>
                <button className={'w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'}>Submit</button>
            </form> }
        </div>
    )
}