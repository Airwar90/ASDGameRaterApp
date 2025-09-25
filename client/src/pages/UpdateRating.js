import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Game from '../components/game';
import Nav from "../components/nav";
import BasicRating from "../components/BasicRating";

function UpdateRating() {        
    const navigate = useNavigate();
    const token = localStorage.getItem("token");    
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(()=>{ if(!token || !user){
            navigate('/', { replace: true });
    }},[navigate, token, user]);

    const location = useLocation();
    const info = location.state?.info;
   
    const [value, setValue] = useState(info?.rating ?? 0);
    
    async function handleUpdateRating(e){
        e.preventDefault();
        if (!value){
            alert("You must select a rating");
            return;
        }
        try {
            const res = await fetch(`http://localhost:8080/api/games/update-rate/${info.id}`,  {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },            
                body: JSON.stringify({                    
                    rating: value
                })
            });
            const data = await res.json();
            if (res.ok){
                navigate('/userRatings');
            } else {
                alert(data.message);
            }
        } catch (error){
            alert("error submitting rating, try again");
        }
    }

    return (
        <div>
            <div className="content-wrap">
                <Nav user = {user}></Nav>
                <div className="game-info">
                    {info?.game ? (                        
                        <Game game={info?.game} />                        
                    ) : (
                        <p>No game selected.</p>
                    )}
                </div>
                <div className="rating-wrapper">
                    <BasicRating value = {value} onChange={setValue}/>
                    <button type="submit" onClick={(e)=>handleUpdateRating(e)}>submit update</button>
                </div>
            </div>
        </div>
    )
}

export default UpdateRating;
//useLocation and state source https://www.youtube.com/watch?v=HLwR7fTB_NM 