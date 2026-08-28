import React, {useEffect} from 'react'
import {toast} from "react-toastify";
import axios from "axios";

export const AppContent = React.createContext();

export const AppContextProvider = ({children}) => {
    axios.defaults.withCredentials = true;
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLogged, setIsLogged] = React.useState(false);
    const [userData, setUserData] = React.useState(false);

    const getAuthState = async () => {
        try{
            const {data} = await axios.get(`${backendUrl}/api/auth/is-auth`);
            if(data.success){
                setUserData(true);
                await getUserData()
            }
        }catch(err){
            toast.error(err.message)
        }
    }

    const getUserData = async () => {
        try{
            const {data} = await axios.get(`${backendUrl}/api/user/data`);
            data.success ? setUserData(data.userData) : toast.error(data.message);
        }catch(err){
            toast.error(err.message)
        }
    }

    useEffect(() => {
        getAuthState();
    },[])

    const value = {
        backendUrl,
        isLogged, setIsLogged,
        userData, setUserData,
        getUserData
    }
    return(
        <AppContent.Provider value={value}>
            {children}
        </AppContent.Provider>
    )
}