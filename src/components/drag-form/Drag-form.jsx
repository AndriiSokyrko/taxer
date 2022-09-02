import React, {useCallback, useEffect, useMemo, useState} from 'react';
import './Drag-form.scss'
import {useNavigate} from "react-router-dom";
import ASN1 from "@lapo/asn1js";

const DragForm = () => {
    const store = localStorage
    const navigate = useNavigate()
    const dragStart = (e) => {
        e.preventDefault();

    }
    const dragEnter = (e) => {
        e.preventDefault();

    }
    const dragOver = (e) => {
        e.preventDefault();
    }
    const dragDrop = (e) => {
        e.preventDefault();

        const file = e.dataTransfer.files[0]
        const reader = new FileReader()
        // reader.readAsText(file, 'UTF-8');
        reader.readAsBinaryString(file,'UTF-8')
        reader.onload = () => {
            const id = new Date().getTime().toLocaleString()
            const buf =ASN1.decode(reader.result)
            if (buf.typeName() !== 'SEQUENCE') {
                throw 'Неправильна структура конверта сертифіката (очікується SEQUENCE)';
            }
            const prettyText = buf.toPrettyString()
            store.setItem(id, prettyText);
            navigate('/user/showInfo')
        }
    }
useEffect(()=>{

},[store])
    return (
        <div className="wrapper--dragform">
            <div className = "dropzone" onDrop={dragDrop}
            onDragStart={dragStart} onDragEnter={dragEnter} onDragOver={dragOver}>
                <p className="dropzone">Drop and  <i>down your </i>file</p >
            </div >
        </div>

    )

}

export default DragForm;
