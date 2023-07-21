import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import io from 'socket.io-client';
import Model from './Model';
import VirtualModels from './VirtualModels';



const socket = io('http://localhost:4000'); // Replace with your server URL

const PlayersCanvas = () => {
  const [playerId, setPlayerId] = useState(null);
  const [playerData, setPlayerData] = useState({});
  

  useEffect(() => {
    socket.on('playerId', ({ playerId }) => {
      setPlayerId(playerId);
    });

    socket.on('playerData', (data) => {
      setPlayerData(data);
    });

    return () => {
      socket.off('playerId');
      socket.off('playerData');
    };
  }, []);

  return (
    <mesh camera={{ position: [0, 5, 10], fov: 60 }} shadowMap style={{ height: '100vh', width: '100%' }}>
      

      {Object.entries(playerData).map(([otherPlayerId, otherPlayerData]) => (
        <VirtualModels
          key={otherPlayerId}
          playerId={otherPlayerId}
          position={otherPlayerData.position}
          rotation={otherPlayerData.rotation}
        />
      ))}

      {playerId && (
        <VirtualModels
          playerId={playerId}
          position={playerData[playerId]?.position}
          rotation={playerData[playerId]?.rotation}
        />
      )}
    </mesh>
  );
};

export default PlayersCanvas;