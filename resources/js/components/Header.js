import React from 'react'
import {NavButtons} from "../componentsData/Data";
import {AuthContainer} from "./partials/AuthContainer";

export const Header = ({page})=>{

    return(
        <div className="header-container">
            <AuthContainer buttonsName={NavButtons[page]}/>
            <h1>{NavButtons[page][1].header}</h1>
        </div>
    )
};


