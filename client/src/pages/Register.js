import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

function Register() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');

    async function handleRegistration(e){
        e.preventDefault();
        const res = await fetch('http://localhost:8080/api/auth/register', {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username,
                email,
                password,
                confirmedPassword
            })
        });
        const data = await res.json();
        if (res.ok){
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate('/homePage');
        } else {
            alert(data.message);
        }
    }

    return(
        <div className='page-container'>      
            <div className='landing-header'>
                <h1 className='title'>
                    Register to GameRater
                </h1>      
            </div>  
            <div className="content-wrap">
                <div className='auth-form'>
                <form>
                    <label>Email</label>
                    <input type='text' placeholder='Enter Email...' value={email} onChange={e=> setEmail(e.target.value)}/>
                    <br />
                    <label>Username</label>
                    <input type='text' placeholder='Enter Username...' value={username} onChange={e=> setUsername(e.target.value)}/>
                    <br />
                    <label>Password</label>
                    <input type='password' placeholder='Enter Password...' value={password} onChange={e=> setPassword(e.target.value)}/>
                    <label>Confirm Password</label>
                    <input type='password' placeholder='Enter Password Confirmation...' value={confirmedPassword} onChange={e=> setConfirmedPassword(e.target.value)}/>
                    <button type="submit" onClick={handleRegistration}>Register</button>
                </form>
                </div>
            </div>            
        </div>
    )
}

export default Register;