import React from 'react';

export const AuthContainer = ({buttonsName})=>
    <div className='auth-container'>
        <p><a href={buttonsName[0].href} className='btn btn-outline-info'>{buttonsName[0].title}</a></p>
    </div>

