import React, {Component} from 'react';
import {TextInput} from "./partials/TextInput";

export default class Login extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        let {links, ajax} = this.props;
        return (
            <form action="/login" method='POST'>
                <TextInput label={'login'} name={'login'} type={'text'}/>
                <TextInput label={'password'} name={'password'} type={'password'}/>
            </form>
        )
    }
}
