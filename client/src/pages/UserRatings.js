import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Game from '../components/game';
import Nav from '../components/nav';
import '../App.css';
import BasicRating from '../components/BasicRating';

function UserRatings(){
    
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));    
    const [results, setResults] = useState([]);
    useEffect(()=>{loadUserRatings()},[]);
    
    async function loadUserRatings(){
        const res = await fetch("http://localhost:8080/api/games/userratings", {
            method: 'POST',
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({userId: user.id})
        });
        const data = await res.json();
        if(res.ok){
            setResults(data);
        } else {
            alert(data.message);
        }
    }
    return(
        <div className='page-container'>
            <Nav user = {user}></Nav>
            <div className='title'>
                <h3>Your rated games</h3>
            </div>
            <div className='game-grid'>
                <div className='game-and-rating'>
                    {results.length > 0 && (
                        results.map((info) => (
                            <div key={info.id}>
                                <Link to="/updateRating" state={{info}}>
                                    <Game game = {info.game}/>
                                </Link>
                                <BasicRating value={info.rating} readOnly = {true}/>
                            </div>
                        )))
                    }
                </div>
            </div>
        </div>
    )
}
export default UserRatings;