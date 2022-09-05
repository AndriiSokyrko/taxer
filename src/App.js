import React from "react";
import './App.scss';
import {BrowserRouter} from "react-router-dom";
import AppRouters from "./routers/AppRouters";
import {AuthContext} from "./components/context";
import {useState} from "react";
function App() {
    const  [userInfo, setUserInfo]= useState({common:'',issuer:'',dateFrom:'',dateTo:''})
  return (
      <AuthContext.Provider value= {{userInfo, setUserInfo}}>
      <BrowserRouter >
        <div className = "main" >
          <AppRouters />
        </div >
      </BrowserRouter >
      </AuthContext.Provider >
  );
}

export default App;
