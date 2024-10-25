import React, { useContext,useEffect,useState } from "react";
import { Outlet, Navigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthProvider"; // Asegúrate de ajustar la ruta de importación
import { LoginContext } from "./Auth/login";
import logoCue from "../images/logo-cue.png"
import "./css/application.css"
import "./css/resize.css"


function NavHeader({valueNavHeader}){

    if(valueNavHeader==false){
        return
    }

    return(
        <nav className={`nav-options-pages`}>
                    <Link to="/publications">Publicaciones</Link>
                    <Link to="/my-publications">Mis publicaciones</Link>
                    <Link to={"/offer"}>Mis Ofertas</Link>
                    <Link to="/my-products">Mis productos</Link>
                    <Link to={"/transacciones"}>Transacciones</Link>
                    <Link to="/green-page" target="_blank" rel="noopener">Economia circular</Link>
         </nav>
    )
}

function IconMenuResize({valueMenuOpen,toggleMenu,setNavHeaderBody,navHeaderBody}){

    

    if(valueMenuOpen===false){
        return
    }

    
    const changeToogleMenuState = ()=>{
        toggleMenu(!valueMenuOpen)
        setNavHeaderBody(!navHeaderBody)
    }

    return(
        <div className="menu-icon" onClick={changeToogleMenuState}>
            &#9776;
        </div>
    )
}


function NavHeaderBody ({navHeaderBody,setNavHeaderBody}){

    if(navHeaderBody===false){
        return
    }

    const deactiveNavHeaderBody = () =>{
        setNavHeaderBody(false)
    }


    return(
             <div
                    className="div-menu-resize"
                >
                    <div className="div-link-redirection">
                      <Link to="/publications" onClick={deactiveNavHeaderBody}>Publicaciones</Link>
                    </div>
                    <div className="div-link-redirection">
                        <Link to="/my-publications" onClick={deactiveNavHeaderBody}>Mis publicaciones</Link>
                    </div>
                    <div className="div-link-redirection">
                        <Link to={"/offer"} onClick={deactiveNavHeaderBody}>Mis Ofertas</Link>
                    </div>
                    <div className="div-link-redirection">
                         <Link to="/my-products" onClick={deactiveNavHeaderBody}>Mis productos</Link>
                    </div>
                    <div className="div-link-redirection">
                         <Link to={"/transacciones"} onClick={deactiveNavHeaderBody}>Transacciones</Link>
                    </div>
                   
                   <div className="div-link-redirection">
                         <Link to="/green-page" onClick={deactiveNavHeaderBody}>Economia circular</Link>
                   </div>    
                </div>
    )
}
export function ProtectedRoute(){
    const { isAuth } = useContext(AuthContext);
    const { logout } = useContext(AuthContext);
    const {username} = useContext(AuthContext)
    const [navHeader,setNavHeader] = useState(true)
    const [menuOpen, setMenuOpen] = useState(false);
    const [navHeaderBody,setNavHeaderBody] = useState(false)
    const [screenWidth, setScreenWidth] = useState(window.innerWidth);

    const exitSesion = () =>{
        logout()
    }


    useEffect(() => {
        const handleResize = () => {
            setScreenWidth(window.innerWidth);
            if (window.innerWidth <= 1200) {
                setMenuOpen(true);
                setNavHeader(false)
            } else {
                setMenuOpen(false);
                setNavHeader(true)
                setNavHeaderBody(false)
            }
        };

        window.addEventListener('resize', handleResize);

        // Initial check
        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    });


    return (
        isAuth
        ? <div className="container-application">
            <div className="container-nav-application">
                <div className="div-nav-application-cue">
                    <img src={logoCue} alt="cue-img" />
                </div>
                <IconMenuResize
                    valueMenuOpen={menuOpen}
                    toggleMenu={setMenuOpen}
                    navHeaderBody={navHeaderBody}
                    setNavHeaderBody={setNavHeaderBody}
                >

                </IconMenuResize>
                <NavHeader
                    valueNavHeader={navHeader}
                >

                </NavHeader>
                <div className="div-nav-auth">
                    <div className="div-nav-profile">
                        <Link to={"/my-profile"}>@{username}</Link>
                    </div>
                    <div className="div-close-session">   
                     <a onClick={exitSesion}>Cerrar sesión</a>
                    </div>
                </div>
            </div>
            <div className="father-div-content-aplication">
                <NavHeaderBody
                    setNavHeaderBody={setNavHeaderBody}
                    navHeaderBody={navHeaderBody}
                ></NavHeaderBody>
                <Outlet></Outlet>
            </div>
    </div>
    : <Navigate to="/"></Navigate>
    )
}
