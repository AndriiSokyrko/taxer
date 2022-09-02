import React from 'react';
import { Route, Routes} from "react-router-dom";

import Form from "../components/form/Form";
import Main from "../components/main/Main";
import DragForm from "../components/drag-form/Drag-form";
import ShowForm from "../components/show-form/Show-form";

const AppRouters = () => {

    return (

            <Routes >
                    <Route path = "/" element = {<Form />} exact key = {Route.path} />
                    <Route path = "/user" element = {<Form />} exact key={Route.path} >
                        <Route path = "dragForm" element = {<DragForm />} exact key={Route.path} />
                        <Route path = "showInfo"  element = {<ShowForm />} exact key={Route.path} />
                    </Route>
            </Routes >

    );
};

export default AppRouters;
