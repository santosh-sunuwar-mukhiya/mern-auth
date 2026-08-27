import React from 'react'
import {assets} from '../assets/assets'

export default function Login() {
  const [state, setState] = React.useState('Sign Up')
  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-blue-200 to purple-400'>
      <img src={assets.logo} className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>
      <div>
        <h2>{state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</h2>
        <p>{state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>
      </div>
    </div>
  )
}