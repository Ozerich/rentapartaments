import React from 'react';
import TextField from '@material-ui/core/TextField';
export const TextInput = ({name,label,value,error,onChange,type='text'})=>
    <TextField type={type} name={name} label={label} variant="outlined" size='small' value={value}  error={error} onChange={onChange}/>


