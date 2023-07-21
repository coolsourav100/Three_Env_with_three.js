import React, { Suspense,useEffect, useRef , useState } from 'react';
import { Canvas ,useFrame} from '@react-three/fiber';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import { OrbitControls, Preload, useGLTF } from '@react-three/drei';
import * as THREE from 'three'
import Room from './Room';
import io from 'socket.io-client';
import Model from './Model';
import Loader from '../Loader';

const socket = io('http://localhost:4000'); // Replace with your server URL

const VirtualModels = () => {
  // const { nodes } = useGLTF('https://models.readyplayer.me/6185a4acfb622cf1cdc49348.glb');
  const [position, setPosition] = useState([0, 0, 0]);
  const [rotation, setRotation] = useState(0);
  const [playerData, setPlayerData] = useState({});
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  
  // }, []);

  useEffect(() => {
    const receiveChatMessage = (message) => {
      setChatMessages((prevMessages) => [...prevMessages, message]);
    };
    
    socket.on('playerData', (data) => {
      setPlayerData(data);
    });
    socket.on('chatMessage', receiveChatMessage);

    // Clean up event listeners on unmount
    return () => {
      socket.off('playerData');
      socket.off('chatMessage', receiveChatMessage);
    };
  }, [chatMessages]);

  const handleChatInputChange = (event) => {
    setChatInput(event.target.value);
  };

  const handleSendChatMessage = () => {
    if (chatInput.trim() !== '') {
      socket.emit('chatMessage', chatInput);
      setChatInput('');
    }
  };

  return (
    <>
    <Canvas camera={{ position: [0, 5, 10], fov: 60 }} shadowMap style={{ height: '100vh', width: '100%' }}>
    <Suspense fallback={<Loader />}>
      
      <Room scale={0.5} position={[0, -1, 0]} />
     
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.5} penumbra={1} />
     
       <VirtualModel  position={position} rotation={rotation} />
       

      {/* Render virtual models for other players */}
    
      {Object.keys(playerData).map((playerId,ind) => {
        console.log(playerId,socket.id,'rotation,position' )
        if (playerId !== socket.id) {
          const { position: playerPosition, rotation: playerRotation } = playerData[playerId];
          return (<Model position={playerPosition} rotation={playerRotation} />);
        }
        return null;
      })}
      
      </Suspense>
      </Canvas>
    <div className='card chatbox'>
    <h1>Chat Box</h1>
      <div className='form-control'>
      {/* Render chat messages */}
      {chatMessages.map((message, index) => (
        <div key={index}>{message}</div>
      ))}
    </div>
      <div >
        <input className='form-control' type="text" value={chatInput} onChange={handleChatInputChange} />
        <button className='btn btn-dark' onClick={handleSendChatMessage}>Send</button>
      </div>
      </div>
      </>
  );
};



export default VirtualModels;

const VirtualModel = ({ position, rotation , pId }) => {
  const { nodes } = useGLTF('https://models.readyplayer.me/6185a4acfb622cf1cdc49348.glb');
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  const clock = useRef(new THREE.Clock()).current;
  const roomSize = 10; // Adjust the room size according to your scene

  const [playerData, setPlayerData] = useState({});

  // Set initial position and rotation
  const [currentPosition, setCurrentPosition] = useState(position);
  const [currentRotation, setCurrentRotation] = useState(rotation);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'w':
          setMovement((prevMovement) => ({ ...prevMovement, forward: true }));
          break;
        case 's':
          setMovement((prevMovement) => ({ ...prevMovement, backward: true }));
          break;
        case 'a':
          setMovement((prevMovement) => ({ ...prevMovement, left: true }));
          break;
        case 'd':
          setMovement((prevMovement) => ({ ...prevMovement, right: true }));
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.key) {
        case 'w':
          setMovement((prevMovement) => ({ ...prevMovement, forward: false }));
          break;
        case 's':
          setMovement((prevMovement) => ({ ...prevMovement, backward: false }));
          break;
        case 'a':
          setMovement((prevMovement) => ({ ...prevMovement, left: false }));
          break;
        case 'd':
          setMovement((prevMovement) => ({ ...prevMovement, right: false }));
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  useEffect(() => {
    const emitPlayerData = () => {
      socket.emit('playerData', {
        playerId: socket.id,
        position: currentPosition,
        rotation: currentRotation,
      });
    };

    emitPlayerData();
    const updatePlayerData = (playerData) => {
      setPlayerData(playerData);
    };

    socket.on('playerData', updatePlayerData);

    return () => {
      socket.off('playerData', updatePlayerData);
    };
  }, [currentPosition, currentRotation]);

  useFrame(() => {
    const deltaTime = clock.getDelta();
    const speed = 2; // Adjust the walking speed
    const rotationSpeed = 4; // Adjust the rotation speed

    // Calculate the forward movement
    if (movement.forward) {
      const newPosition = [
        currentPosition[0] - Math.sin(currentRotation) * speed * deltaTime,
        currentPosition[1],
        currentPosition[2] - Math.cos(currentRotation) * speed * deltaTime,
      ];
      if (!isColliding(newPosition)) {
        setCurrentPosition(newPosition);
      }
    }
    // Calculate the backward movement
    if (movement.backward) {
      const newPosition = [
        currentPosition[0] + Math.sin(currentRotation) * speed * deltaTime,
        currentPosition[1],
        currentPosition[2] + Math.cos(currentRotation) * speed * deltaTime,
      ];
      if (!isColliding(newPosition)) {
        setCurrentPosition(newPosition);
      }
    }
    // Calculate the rotation for left movement
    if (movement.left) {
      setCurrentRotation((prevRotation) => prevRotation + rotationSpeed * deltaTime);
    }
    // Calculate the rotation for right movement
    if (movement.right) {
      setCurrentRotation((prevRotation) => prevRotation - rotationSpeed * deltaTime);
    }

    // Update the walking animation
    const walkingSpeed = 8; // Adjust the walking animation speed
    const isWalking = movement.forward || movement.backward || movement.left || movement.right;
    const elapsedTime = clock.elapsedTime;

    nodes.LeftLeg.rotation.x = isWalking ? Math.sin(elapsedTime * walkingSpeed) * 0.2 : 0;
    nodes.RightLeg.rotation.x = isWalking ? -Math.sin(elapsedTime * walkingSpeed) * 0.2 : 0;
    nodes.LeftHand.rotation.x = isWalking ? Math.sin(elapsedTime * walkingSpeed) * 0.2 : 0;
    nodes.RightHand.rotation.x = isWalking ? -Math.sin(elapsedTime * walkingSpeed) * 0.2 : 0;
  });

  const isColliding = (newPosition) => {
    const collisionRadius = 0.5; // Adjust the collision radius based on the model's size

    // Check collision with walls and windows
    if (
      newPosition[0] < -roomSize / 2 + collisionRadius ||
      newPosition[0] > roomSize / 2 - collisionRadius ||
      newPosition[2] < -roomSize / 2 + collisionRadius ||
      newPosition[2] > roomSize / 2 - collisionRadius
    ) {
      return true;
    }
    // socket.emit('playerData', { playerId: socket.id, currentPositio, currentRotation });
  
    // Add more collision detection logic as needed for other objects in the room

    return false;
  };

  return (
    <group>
      <mesh position={currentPosition} rotation={[0, currentRotation, 0]} scale={1}>
        {/* Your light sources */}
        <spotLight
          position={[-20, 50, 10]}
          angle={0.45}
          penumbra={0.5}
          intensity={1}
          // castShadow
          shadow-mapSize={1024}
        />
        <pointLight intensity={1} />
        <primitive object={nodes.Scene} />
      </mesh>
    </group>
  );
};