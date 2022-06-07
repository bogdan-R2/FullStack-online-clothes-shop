import React, {useState} from 'react';
import { Functions } from '../agent';
import {useNavigate} from 'react-router-dom';
import { toast } from "react-toastify";
const Login = () => {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const onSubmit = () => {
        Functions.login({ password, mail}).then(response => {
            toast.success("logare reusita");
            localStorage.setItem("token", response.data.token);
            navigate('/');
        }, err => {
            console.log("eroare");
            toast.error("date de conectare invalide");
        })
    }
  return <div>
      <input value={mail} onChange={(e) => setMail(e.target.value)} placeholder='mail'/>
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password' type="password"/>
      <button onClick={onSubmit}>Login</button>
    </div>;
};

export default Login;
