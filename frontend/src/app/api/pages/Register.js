import React, {useState} from 'react';
import { Functions } from '../agent';
import {useNavigate} from 'react-router-dom';
import { toast } from "react-toastify";

const Register = () => {
    const [mail, setMail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const navigate = useNavigate();

    const onSubmit = () => {
        Functions.register({username, password, mail}).then(response => {
            toast.success("logare reusita");
            localStorage.setItem("token", response.data.token);
            navigate('/');
        }).catch(err => {
            toast.error("unknown error");
        });
    }
  return <div>
      <input value={mail} onChange={(e) => setMail(e.target.value)} placeholder='mail'/>
      <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder='password' type='password'/>
      <input value={username} onChange={(e) => setUsername(e.target.value)} placeholder='username'/>
      <button onClick={onSubmit}>Register</button>
    </div>;
};

export default Register;
