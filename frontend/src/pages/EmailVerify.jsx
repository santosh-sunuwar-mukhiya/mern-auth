import {assets} from "../assets/assets.js";
import {useNavigate} from "react-router-dom";
import React from "react";

export default function EmailVerify() {
    const inputRefs = React.useRef([]);
    const navigate = useNavigate();
    const handleInput = async (e, i) => {
        if(e.target.value.length > 0 && i < inputRefs.current.length - 1) {
            inputRefs.current[i + 1].focus()
        }
    }

    const handleKeyDown = (e, i) => {
        if (e.key === 'Backspace' || e.target.value === '' && i > 0) {
            inputRefs.current[i - 1].focus()
        }
    }

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData("text/plain");
        const pasteArray = paste.split('');
        pasteArray.forEach((char, i) => {
            if(inputRefs.current[i]){
                inputRefs.current[i].value = char;
            }
        })
    }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img onClick={()=> navigate('/')} src={assets.logo} alt={'logo'} className={'absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'} />
        <form className={'bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'}>
            <h1 className={'text-white text-2xl font-semibold text-center mb-4'}>Email Verify OTP</h1>
            <p className={'text-center mb-6 text-indigo-300'}>Enter the 6 digit code sent to your email id.</p>
            <div className={'flex justify-between mb-8'} onPaste={handlePaste}>
                {Array(6).fill(0).map((_, i) =>(
                    <input type={'text'} key={i} maxLength={1} required
                           className={'w-12 h-12 bg-[#333A53] text-white text-center text-xl rounded-md'}
                           ref={e => inputRefs.current[i] = e}
                           onInput={(e)=> handleInput(e, i)}
                           onKeyDown={(e)=>handleKeyDown(e, i)}
                    />
                ))}
            </div>
            <button className={'w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full'}>Verify Email</button>
        </form>
    </div>
  )
}