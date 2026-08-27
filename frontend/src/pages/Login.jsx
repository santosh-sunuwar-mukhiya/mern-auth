import React, {useContext} from 'react'
import {assets} from '../assets/assets'
import {useNavigate} from "react-router-dom";
import {AppContent} from "../context/AppContext.jsx";
import axios from "axios";
import {toast} from "react-toastify";

export default function Login() {

  const navigate = useNavigate()

  const {backendUrl, setIsLogged, getUserData} = useContext(AppContent);

  const [state, setState] = React.useState('Sign Up')
  const [name, setName] = React.useState('')
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()

    axios.defaults.withCredentials = true;

    try{
      if(state === 'Sign Up'){
        const {data} = await axios.post(`${backendUrl}/api/auth/register`, {name, email, password});

        if(data.success){
          setIsLogged(true)
          getUserData()
          navigate('/')
        }else{
          toast.error(data.message)
        }
      }else{
        const {data} = await axios.post(`${backendUrl}/api/auth/login`, {email, password});

        if(data.success){
          setIsLogged(true)
          getUserData()
          navigate('/')
        }else{
          toast.error(data.message)
        }
      }
    }catch(err){
      toast.error(err.message)
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to-purple-400'>
      <img onClick={()=> navigate('/')} src={assets.logo} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer' alt={'logo'}/>
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</h2>
        <p className='text-center text-sm mb-6'>{state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>

        <form onSubmit={handleSubmit}>
          {state === 'Sign Up' && (<div className='flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.person_icon} alt={'person icon'}/>
            <input
                onChange={e => setName(e.target.value)}
                value={name}
                type='text' placeholder='fullname' required className='bg-transparent outline-none'
            />
          </div>)}

          <div className='flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt={'mail icon'}/>
            <input
                onChange={e => setEmail(e.target.value)}
                value={email}
                type='email' placeholder='Email Id' required className='bg-transparent outline-none'
            />
          </div>

          <div className='flex items-center gap-3 mb-4 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt={'lock icon'}/>
            <input
                onChange={e => setPassword(e.target.value)}
                value={password}
                type='password' placeholder='Password' required className='bg-transparent outline-none'
            />
          </div>

          <p onClick={()=> navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer'>Forgot password</p>
          <button className={'w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'}>{state}</button>
        </form>

        {state === 'Sign Up' ? (<p className={'text-gray-400 text-center text-xs mt-4'}>Already have an account?{' '} <span  onClick={()=> setState('Login')} className={'text-blue-400 cursor-pointer underline'}>Login here</span></p>)
            : (<p  className={'text-gray-400 text-center text-xs mt-4'}>Don't have an account?{' '} <span onClick={()=> setState('Sign Up')} className={'text-blue-400 cursor-pointer underline'}>Sign Up</span></p>)}
      </div>
    </div>
  )
}