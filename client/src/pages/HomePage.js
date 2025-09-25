import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Game from '../components/game';
import Nav from '../components/nav';
import '../App.css';

 function HomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));  
  const token = localStorage.getItem("token");
  async function checkCred(){if (!token || !user){
          navigate('/');
      }}
      useEffect(()=> { checkCred() }, []);
  const [searchName, setSearchName] = useState('');
  const [results, setResults] = useState([]);

  async function handleSearch(e){
    e.preventDefault();
    const res = await fetch("http://localhost:8080/api/games/search", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
            name: searchName.trim()
        })
    });
    const data = await res.json();
    if(res.ok) {  
        console.log('IGDB response', data);      
        setResults(data);        
    } else {
        alert(data.message);
    }
  }

  return(
    <div className='page-container'>
        <Nav user = {user}></Nav>
        <div className='home-header'>
            <h1 className='Title'>Welcome to GameRater</h1>
            <h3 className='Subtitle'>Search for game to rate</h3>
        </div>    
        <div className='content-wrap'>
            <div className='searchBar'>
                <form>
                    <input type='text' placeholder='Enter game name...' value={searchName} onChange={e=> setSearchName(e.target.value)}/>
                    <button type="submit" onClick={handleSearch}>Search</button>
                </form>
            </div>
            {results.length > 0 &&
                results.map((g) => (
                    <div key={g.id}>
                        <Link to="/AddRating" className="card-link" state={{game: g}}>
                            <Game game={g} />
                        </Link>
                    </div>
                ))
            }
        </div>
    </div>
  )
 
}
export default HomePage;