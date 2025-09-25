import React from 'react';
import '../App.css';
import { Link, useNavigate } from "react-router-dom";

function Nav({ user }) {
  const navigate =  useNavigate();
  function handleLogout(){
    localStorage.clear();
    navigate("/");
  }
  return (
    <div className='navigation-menu'>  
        <div>
            <h1 id="navbar-title" >GameRater</h1>
        </div>    
              
        { user ? (              
              <ul>
                <li id='nav-username'>Welcome Back, {user.username}!</li>
                <li><Link to={"/userRatings"}>Your Ratings</Link></li>                
                <li><Link to={"/homePage"}>Home</Link></li>
                <li>
                    <button
                    onClick={handleLogout}
                    className="logout-btn"
                    aria-label="Log out"
                    >
                    Log Out
                    </button>
                </li>
              </ul>
        ) : (
          <ul>
            <li><Link to ={"/register"}>Register</Link></li>
            <li><Link to ={"/login"}>Log In</Link></li>              
          </ul>
        )
        }
    </div>
  )
} 

export default Nav;