import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import axios from 'axios';



const PlayersCanvas = () => {
  
  const [players, setPlayers] = useState([
    { id: 1, position: [0, 0, 0], rotation: 0 },
    { id: 2, position: [1, 0, 1], rotation: 0 },
    // Add more players as needed
  ]);

  useEffect(() => {
   axios.get('http://localhost:4000/player/allplayer').
   then(res=>{
    console.log(res, 'players')
   })
    // You can update the player positions and rotations from server data here
  }, []);

  const handlePlayerMove = (playerId, newPosition, newRotation) => {
    setPlayers((prevPlayers) =>
      prevPlayers.map((player) =>
        player.id === playerId ? { ...player, position: newPosition, rotation: newRotation } : player
      )
    );
  };

  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 60 }} shadowMap style={{ height: '100vh', width: '100%' }}>
      <Room scale={0.5} position={[0, -1, 0]} />

      {/* Render virtual models for each player */}
      {players.map((player) => (
        <VirtualModel
          key={player.id}
          position={player.position}
          rotation={player.rotation}
          onMove={(newPosition, newRotation) => handlePlayerMove(player.id, newPosition, newRotation)}
        />
      ))}
    </Canvas>
  );
};

export default PlayersCanvas;