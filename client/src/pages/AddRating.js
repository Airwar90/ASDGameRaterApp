import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Game from '../components/game';
import Nav from "../components/nav";
import BasicRating from "../components/BasicRating";

function AddRating() {
    const location = useLocation();    
    const navigate = useNavigate();
    const [value, setValue] = useState(0);
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
      async function checkCred(){if (!token || !user){
              navigate('/');
          }}
          useEffect(()=> { checkCred() }, []);

    async function handleAddRating(e){
        e.preventDefault();
        if (!value){
            alert("You must select a new rating");
            return;
        }
        try {
            const res = await fetch("http://localhost:8080/api/games/rate",  {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },            
                body: JSON.stringify({
                    gameId: location.state.game.id,
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
            <div className="page-container">
                <Nav user = {user}></Nav>
                <div className="content-wrap">
                    <div className="game-info">
                        {location.state?.game ? (                        
                            <Game game={location.state.game} />                        
                        ) : (
                            <p>No game selected.</p>
                        )}
                    </div>
                    <div className="rating-wrapper">
                        <BasicRating value = {value} onChange={setValue}/>
                        <button type="submit" onClick={(e)=>handleAddRating(e)}>submit rating</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddRating;
//useLocation and state source https://www.youtube.com/watch?v=HLwR7fTB_NM 