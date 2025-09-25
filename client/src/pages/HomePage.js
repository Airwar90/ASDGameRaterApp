import React, { useEffect, useState } from 'react'
import Game from '../components/game';
import '../App.css';

 function HomePage() {
  const user = JSON.parse(localStorage.getItem("user"));  
  const token = localStorage.getItem("token");

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
        <div className='header'>
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
                <Game key={g.id} game={g} />
                ))
            }
        </div>
    </div>
  )
 
}
export default HomePage;