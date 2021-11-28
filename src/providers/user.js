import React, { useState, useEffect } from 'react';

export const UserContext = React.createContext({})
 
export const UserProvider = (props) => {
    const [user,setUser] = useState({token:"",perfil:"",idusuario:""})
    useEffect(() => {
        const token = localStorage.getItem("token")
        const idusuario = localStorage.getItem("idusuario")
        const perfil = localStorage.getItem("perfil")

        if(token){
            setUser({token:token,perfil:perfil,idusuario:idusuario})
        } else {
            setUser({token:"",perfil:"",idusuario:""})
        }
      }, []);

    return (
        <UserContext.Provider value={{user,setUser}}>
            {props.children}
        </UserContext.Provider>
    )
}

export const useUser = () => React.useContext(UserContext)