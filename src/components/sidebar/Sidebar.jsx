import React, {useContext, useEffect, useState} from 'react';
import './Sidebr.scss'
import {AuthContext} from "../context";

const Sidebar = (props) => {
    const store = localStorage
    const [listOfCert,setListOfCert] =useState({})
    const {userInfo, setUserInfo}= useContext(AuthContext)
    const [active,setActive] = useState('')

    const firstRecord =(id)=>{
         Object.keys(listOfCert).forEach((key)=> {
             if (id === key) {
                 const elm = listOfCert[key]
                 setUserInfo({
                     common: elm.commonName,
                     dateFrom: elm.dateFrom,
                     dateTo: elm.dateTo,
                     issuer: elm.issuerName,
                 })

             }
         })
    }
    const showInfo =(e)=>{
          const  id = e.target.id
        setActive(id)
        Object.keys(listOfCert).forEach((key)=> {
            if (id === key) {
                const elm = listOfCert[key]
                setUserInfo({
                    common: elm.commonName,
                    dateFrom: elm.dateFrom,
                    dateTo: elm.dateTo,
                    issuer: elm.issuerName,
                })
            }
        })
    }

const getAttr =  (buf,OBJECT_IDENTIFIER,shift=5) => {

        switch (OBJECT_IDENTIFIER){
            case '2.5.4.3' :

                const regStartC = new RegExp('@.*(' + OBJECT_IDENTIFIER + ')', 'gui')
                const regC = buf.match(regStartC)
                if(regC===null)return
                let posNumC = +regC[1].split('+')[0].substr(1) + shift
                let regexpC = new RegExp('@' + posNumC + '\\+\\d*:.*?(?=SET)', 'sgui')
                const regNextC = buf.match(regexpC)
                return regNextC[0].split(':')[1]
            case '2.5.4.11':
                const regStartI = new RegExp('@.*(' + OBJECT_IDENTIFIER + ')', 'gui')
                const regI = buf.match(regStartI)
                if(regI===null)return
                let posNumI = +regI[0].split('+')[0].substr(1) + shift
                let regexpI =new RegExp('@' + posNumI + '\\+\\d*:.*?(?= SET)', 'sgui')
                const regNextI = buf.match(regexpI)

                return regNextI[0].split(':')[1]
            case '2.5.4.7' :
                const regStartTF = new RegExp('@.*(' + OBJECT_IDENTIFIER + ')', 'gui')
                const regTF = buf.match(regStartTF)
                if(regTF===null)return
                let posNumTF = +regTF[0].split('+')[0].substr(1) + shift+5
                let regexpTF = new RegExp('@' + posNumTF + '\\+\\d*:.*?(?=UTC)', 'sgui')
                const regNextTF = buf.match(regexpTF)
                return regNextTF[0].split(':')[1]
            case 'UTCTime':
                const regStartTT = new RegExp('('+OBJECT_IDENTIFIER + '.*?:).*?(?=UTC)', 'gui')
                const regTT = buf.match(regStartTT)
                if(regTT===null)return
                let regNextTT =
                shift===12?
                regTT[0].split(':')[1].substr(1)  :
                regTT[1].split(':')[1].substr(1)
                return regNextTT+':00'
            default:
                return
        }

}

    const common =  (buf,OBJECT_IDENTIFIER,shift=5) => {
        const commonName =getAttr(buf,OBJECT_IDENTIFIER,shift)
        return commonName
    }

    const issuer = (buf,OBJECT_IDENTIFIER,shift=5) => {
        const issuerName =getAttr(buf,OBJECT_IDENTIFIER,shift)
        return issuerName
    }

    const date_from =  (buf,OBJECT_IDENTIFIER,shift=12) => {
        const dateFrom =getAttr(buf,OBJECT_IDENTIFIER,shift)
        return dateFrom
    }

    const date_to =  (buf,OBJECT_IDENTIFIER,shift=27) => {
        const dateTo =getAttr(buf,OBJECT_IDENTIFIER,shift)
        return dateTo
    }


    const newElm = (buf,key) => {
        const commonName = common(buf,'2.5.4.3')
        const issuerName = issuer(buf,'2.5.4.11')
        // const dateFrom = date_from(buf,'2.5.4.7')
        const dateFrom = date_from(buf,'UTCTime')
        // const dateTo = date_to(buf,'2.5.4.7')
        const dateTo = date_to(buf,'UTCTime',27)
         const tempArray = {commonName, issuerName, dateFrom, dateTo, key}
          listOfCert[key]=tempArray
            setListOfCert(listOfCert)
            firstRecord(key)
    }

    useEffect(()=>{
        // store.clear()
        // setUserInfo({common:'', dateFrom:'', dateTo:'', issuer:'' })
        // setListOfCert({})
        if( Object.keys(store).length) {
            Object.keys(store).forEach((key, index) => {
                const buf = store.getItem(key)
                newElm(buf, key)
            })
            props.setCheck(true)
        }
    },[ store,props.check])


    return (
        <div className = "wrapper--sidebar" >
            <h1 >List of cert</h1 >

            <div className = "wrapper--sidebar_block" >
                <ul className = "wrapper--ul" >
                    {
                        Object.keys(listOfCert).map(key=> {
                            const elm = listOfCert[key]
                            return <li id={elm.key} className = {active===elm.key?"wrapper--ul_li active":"wrapper--ul_li"} key = {elm.key}
                            onClick={showInfo}
                            >{elm.commonName}</li >
                        })
                    }

                </ul >

            </div >

            <div className = "wrapper--btn" >
                <button id = "addId" className = "btn btn-outline-success"
                        onClick = {() => {
                            setUserInfo({common:'', dateFrom:'', dateTo:'', issuer:'', })

                        }}
                >
                    Додати key
                </button >

            </div >
        </div >
    );
};

export default Sidebar;
