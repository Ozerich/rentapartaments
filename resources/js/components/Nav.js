import React from 'react';

export const Nav = ({links}) => {

    return (
        links.map((item,key)=>
            <div className={'filter-container'}>
                <input id={`tab${key+1}!`} type="radio" name="tabs" checked key={`input${key}`}/>
                    <label htmlFor={`tab${key+1}!`} key={`label${key}`}>{item.title}</label>
            </div>
        )
    )
};
