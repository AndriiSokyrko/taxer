import React, {useEffect} from 'react';
import {useNavigate} from "react-router-dom";
import Sidebar from "../sidebar/Sidebar";
import Main from "../main/Main";
import HeaderForm from "./Header-form";
import './Form.scss'

const Form = () => {
    const store = localStorage
    const navigate = useNavigate()

    useEffect(()=>{

    },[store])
    return (
        <div className="wrapper--form">
            <HeaderForm/>
            <div className="wrapper--form_main">
                <Sidebar/>
                <Main/>
            </div>

        </div >
    );
}

export default Form;
