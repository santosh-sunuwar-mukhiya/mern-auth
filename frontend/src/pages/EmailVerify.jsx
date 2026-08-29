import {assets} from "../assets/assets.js";
import {useNavigate} from "react-router-dom";
import React, {useContext, useEffect} from "react";
import {AppContent} from "../context/AppContext.jsx";
import axios from "axios";
import {toast} from "react-toastify";

export default function EmailVerify() {
    axios.defaults.withCredentials = true;
    const {backendUrl, isLogged, userData, getUserData} = useContext(AppContent);
    const navigate = useNavigate();
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

    const handleSubmit = async (e) => {
        try{
            e.preventDefault();
            const otpArray = inputRefs.current.map(e=> e.value);
            const otp = otpArray.join('');

            const {data} = await axios.post(`${backendUrl}/api/auth/verify-account`,{otp});

            if(data.success){
                toast.success(data.message);
                getUserData();
                navigate('/');
            }else{
                toast.error(data.message);
            }

        }catch(err){
            toast.error(err.message)
        }
    }

    useEffect(() => {
        if (isLogged && userData?.isAccountVerified) {
            navigate('/');
        }
    }, [isLogged, userData,navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img onClick={()=> navigate('/')} src={assets.logo} alt={'logo'} className={'absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'} />
        <form className={'bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'} onSubmit={handleSubmit}>
            <h1 className={'text-white text-2xl font-semibold text-center mb-4'}>Email Verify OTP</h1>
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
            <button className={'w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'}>Verify Email</button>
        </form>
    </div>
  )
}