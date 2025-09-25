import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

function Login() {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    async function handleLogin(e){
        e.preventDefault();
        const res = await fetch("http://localhost:8080/api/auth/login",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                email,
                password
            })
        }) 

        const data = await res.json();
        if(res.ok) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/homePage");
        } else {
            alert(data.message);
        }
    }

    return (    
    <div className='page-container'>
      
      <div className='landing-header'>
        <h1 className='title'>
          Log In to GameRater
        </h1>      
      </div>  
      <div className="content-wrap">
        <div className='auth-form'>
          <form>            
            <input type='text' placeholder='Enter Email...' value={email} onChange={e=> setEmail(e.target.value)}/>
            <br />
            
            <input type='password' placeholder='Enter Password...' value={password} onChange={e=> setPassword(e.target.value)}/>
            <br />
            <button type="submit" onClick={handleLogin}>Log In</button>
          </form>
        </div>
      </div>
      
    </div>
   )
}
export default Login;