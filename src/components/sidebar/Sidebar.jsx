import React, {useCallback, useContext, useEffect, useState} from 'react';
import './Sidebr.scss'
import {useNavigate} from "react-router-dom";
import ASN1  from '@lapo/asn1js';
import {AuthContext} from "../context";

const Sidebar = () => {
    const store = localStorage
    const navigate = useNavigate()
    const [listOfCert,setListOfCert] =useState([])
    const {userInfo, setUserInfo}= useContext(AuthContext)
    const [active,setActive] = useState('')
    const firstRecord =(id)=>{
        const params= listOfCert.filter(elm=>elm.key===id)

        setUserInfo({common:params[0].commonName,
            dateFrom:params[0].dateFrom,
            dateTo:params[0].dateTo,
            issuer:params[0].issuerName,
        })
        navigate("/user/showInfo" )
    }
    const showInfo =(e)=>{
          const  id = e.target.id
        setActive(id)
        const params= listOfCert.filter(elm=>elm.key===id)
        setUserInfo({common:params[0].commonName,
            dateFrom:params[0].dateFrom,
            dateTo:params[0].dateTo,
            issuer:params[0].issuerName,
        })
        navigate("/user/showInfo" )
    }

const getAttr = useCallback((buf,OBJECT_IDENTIFIER,shift=5) => {

        switch (OBJECT_IDENTIFIER){
            case '2.5.4.3' :
                const regStartC = new RegExp('@.*(' + OBJECT_IDENTIFIER + ')', 'gui')
                const regC = buf.match(regStartC)
                let posNumC = +regC[1].split('+')[0].substr(1) + shift
                let regexpC = new RegExp('@' + posNumC + '\\+\\d*:.*?(?=SET)', 'sgui')
                const regNextC = buf.match(regexpC)
                return regNextC[0].split(':')[1]
            case '2.5.4.11':
                const regStartI = new RegExp('@.*(' + OBJECT_IDENTIFIER + ')', 'gui')
                const regI = buf.match(regStartI)
                let posNumI = +regI[0].split('+')[0].substr(1) + shift
                let regexpI =new RegExp('@' + posNumI + '\\+\\d*:.*?(?= SET)', 'sgui')
                const regNextI = buf.match(regexpI)

                return regNextI[0].split(':')[1]
            case '2.5.4.7' :
                const regStartTF = new RegExp('@.*(' + OBJECT_IDENTIFIER + ')', 'gui')
                const regTF = buf.match(regStartTF)
                let posNumTF = +regTF[0].split('+')[0].substr(1) + shift+5
                let regexpTF = new RegExp('@' + posNumTF + '\\+\\d*:.*?(?=UTC)', 'sgui')
                const regNextTF = buf.match(regexpTF)
                return regNextTF[0].split(':')[1]
            case '2.5.4.7' && shift===27:
                const regStartTT = new RegExp('@.*(' + OBJECT_IDENTIFIER + ')', 'gui')
                const regTT = buf.match(regStartTT)
                let posNumTT = +regTT[0].split('+')[0].substr(1) + shift+5
                let regexpTT = new RegExp('@' + posNumTT + '\\+\\d*:.*?(?=UTC)', 'sgui')
                const regNextTT = buf.match(regexpTT)
                return regNextTT[0].split(':')[1]
        }

},[])

    const common = useCallback((buf,OBJECT_IDENTIFIER,shift=5) => {
        const commonName =getAttr(buf,OBJECT_IDENTIFIER,shift)
        return commonName
    },[getAttr])

    const issuer = useCallback((buf,OBJECT_IDENTIFIER,shift=5) => {
        const issuerName =getAttr(buf,OBJECT_IDENTIFIER,shift)
        return issuerName
    },[getAttr])

    const date_from = useCallback((buf,OBJECT_IDENTIFIER,shift=12) => {
        const dateFrom =getAttr(buf,OBJECT_IDENTIFIER,shift)
        return dateFrom
    },[getAttr])

    const date_to = useCallback((buf,OBJECT_IDENTIFIER,shift=27) => {
        const dateTo =getAttr(buf,OBJECT_IDENTIFIER,shift)
        return dateTo
    },[getAttr])


    const newElm = useCallback((buf,key) => {
        setListOfCert([])
        const commonName = common(buf,'2.5.4.3')
        const issuerName = issuer(buf,'2.5.4.11')
        const dateFrom = date_from(buf,'2.5.4.7')
        const dateTo = date_to(buf,'2.5.4.7')
        const tempArray = {commonName, issuerName, dateFrom, dateTo, key}
        listOfCert.push(tempArray)
        setListOfCert(listOfCert)
        firstRecord(key)
    },[common,date_from, date_to,issuer])

    useEffect(()=>{
        setListOfCert([])
            // store.clear()
        let firstKey=''
        Object.keys(store).forEach((key,index) => {

            const buf = store.getItem(key)
                newElm(buf ,buf)
            if(index===0){
                firstKey = key
            }
        })

    },[store])


    return (
        <div className = "wrapper--sidebar" >
            <h1 >List of cert</h1 >

            <div className = "wrapper--sidebar_block" >
                <ul className = "wrapper--ul" >
                    {
                        listOfCert.map((elm, index) => {
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
                            navigate("/user/dragForm")
                        }}
                >
                    Додати key
                </button >

            </div >
        </div >
    );
};

export default Sidebar;
