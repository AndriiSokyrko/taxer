import React, {useEffect} from 'react';
 import './Main.scss'
import {Outlet, useNavigate} from "react-router-dom";
import DragForm from "../drag-form/Drag-form";
const Main = () => {
    const navigate = useNavigate()
    useEffect(()=>{
        navigate('/user/showInfo')
    },[])
    return (
        <div className="wrapper--user_main">
            <h1>Description</h1>
            <Outlet/>
        </div >
    );
};

export default Main;
