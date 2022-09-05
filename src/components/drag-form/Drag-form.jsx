import React from 'react';
import './Drag-form.scss'
import ASN1 from "@lapo/asn1js";

const  DragForm = (props) => {

    const store = localStorage



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
                try {
                    const buf = ASN1.decode(reader.result)
                    if (buf.typeName() !== 'SEQUENCE') {
                        throw Error('Неправильна структура конверта сертифіката (очікується SEQUENCE)');
                    }
                    const prettyText = buf.toPrettyString()
                    store.setItem(id, prettyText);
                    props.setCheck(false)

                } catch (e){
                  throw e.status(500).message()
                }
        }
    }
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
