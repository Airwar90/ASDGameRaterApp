import React from 'react'
import {Link} from 'react-router-dom'

function Landing() {
    return (
        <div className='page-container'>
            <div className='header'>
                <h1 className='Title'>Welcome to GameRater</h1>
                <h3 className='Subtitle'>Register or Log In</h3>
            </div>    
            <div className='content-wrap'>
                <ol className='simple-vertical-list'>
                    <li><Link to={"/register"}>Register</Link></li>
                    <li><Link to={"/login"}>Log In</Link></li>
                </ol>
            </div>
        </div>
    );
}
export default Landing;