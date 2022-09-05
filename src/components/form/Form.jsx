import React, { useState} from 'react';
import Sidebar from "../sidebar/Sidebar";
import Main from "../main/Main";
import HeaderForm from "./Header-form";
import './Form.scss'


const Form = () => {
const [check, setCheck]= useState(true)

// useEffect(()=>{
//     console.log(check);
//     setCheck(true)
// },[check])
    return (
        <div className="wrapper--form">
            <HeaderForm/>
            <div className="wrapper--form_main">
                <Sidebar check = {check} setCheck = {setCheck} />
                <Main check = {check} setCheck = {setCheck} />
            </div>
        </div >
    );
}

export default Form;
