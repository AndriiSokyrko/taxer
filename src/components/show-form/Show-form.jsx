import React, {useContext, useEffect} from 'react';
import './Show-form.scss'
import {AuthContext} from "../context";
const ShowForm = () => {
    const store = localStorage
    const {userInfo, setUserInfo}= useContext(AuthContext)
useEffect(()=>{

},[])
    return (
        <div className="warpper--showform">
            <div>{userInfo.common}</div>
            <div>{userInfo.issuer}</div>
            <div>{userInfo.dateFrom}</div>
            <div>{userInfo.dateTo}</div>
        </div >
    );
};

export default ShowForm;
