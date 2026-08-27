import React from 'react'

export const AppContent = React.createContext();

export const AppContextProvider = ({children}) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    const [isLogged, setIsLogged] = React.useState(false);
    const [userData, setUserData] = React.useState(false);
    const value = {
        backendUrl,
        isLogged, setIsLogged,
        userData, setUserData
    }
    return(
        <AppContent.Provider value={value}>
            {children}
        </AppContent.Provider>
    )
}