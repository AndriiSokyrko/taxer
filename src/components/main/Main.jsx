import React, {useContext} from 'react';
 import './Main.scss'
import {Outlet} from "react-router-dom";
import ShowForm from "../show-form/Show-form";
import DragForm from "../drag-form/Drag-form";
import {AuthContext} from "../context";
const Main = (props) => {
    const {userInfo}= useContext(AuthContext)
    return (
        <div className="wrapper--user_main">
            <h1>Description</h1>
            {userInfo.common.length?
            <ShowForm />
            : <DragForm check={props.check} setCheck={props.setCheck}/>
            }
            <Outlet/>
        </div >
    );
};

export default Main;
