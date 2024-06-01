import React, { useContext } from "react";
import { AuthContext } from "../AuthProvider";
import { Outlet, Navigate} from "react-router-dom";

export function ContainerMyPublications(){
    const { isAuth } = useContext(AuthContext);
    return(
           isAuth
           ?  <Outlet></Outlet>
           : <Navigate to="/login"></Navigate>
    )
}