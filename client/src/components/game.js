import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import '../App.css';

function Game({ game }) {
  return (
    
      <div className="game-card">
        <img src={game.cover} alt={game.name} className="cover-img" />
        <h4 className="game-title">{game.name}</h4>
      </div>
    
  );
}

export default Game;