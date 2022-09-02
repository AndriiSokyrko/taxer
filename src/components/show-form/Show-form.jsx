import React, {useContext} from 'react';
import './Show-form.scss'
import { useParams} from "react-router";
import {AuthContext} from "../context";
const ShowForm = () => {
    const store = localStorage
    const {userInfo, setUserInfo}= useContext(AuthContext)

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
