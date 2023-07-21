import React, { useEffect, useRef , useState } from 'react';
import { Canvas ,useFrame} from '@react-three/fiber';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import { OrbitControls, Preload, useGLTF } from '@react-three/drei';
import * as THREE from 'three'
import Room from './Room';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); // Replace with your server URL

const VirtualModel = (props) => {
  console.log(props)
  const { nodes } = useGLTF('https://models.readyplayer.me/6185a4acfb622cf1cdc49348.glb');
  const [position, setPosition] = useState(props.position);
  const [rotation, setRotation] = useState(props.rotation);
  const [movement, setMovement] = useState({
    forward: false,
    backward: false,
    left: false,
    right: false,
  });
  const clock = useRef(new THREE.Clock()).current;
  const roomSize = 10; // Adjust the room size according to your scene
  const [playerData, setPlayerData] = useState({});
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
        position,
        rotation,
      });
    };
  
    const updatePlayerData = (playerData) => {
      const updatedPlayerData = { ...playerData };
      delete updatedPlayerData[socket.id];
  
      setPlayerData(updatedPlayerData);
    };
  
    // Emit player data to the server
    emitPlayerData();
  
    // Listen for player data updates from the server
    socket.on('playerData', updatePlayerData);
  
    return () => {
      socket.off('playerData', updatePlayerData);
    };
  }, [position, rotation]);

  useFrame(() => {
    const deltaTime = clock.getDelta();
    const speed = 2; // Adjust the walking speed
    const rotationSpeed = 4; // Adjust the rotation speed

    // Calculate the forward movement
    if (movement.forward) {
      const newPosition = [
        position[0] - Math.sin(rotation) * speed * deltaTime,
        position[1],
        position[2] - Math.cos(rotation) * speed * deltaTime,
      ];
      if (!isColliding(newPosition)) {
        setPosition(newPosition);
      }
    }
    // Calculate the backward movement
    if (movement.backward) {
      const newPosition = [
        position[0] + Math.sin(rotation) * speed * deltaTime,
        position[1],
        position[2] + Math.cos(rotation) * speed * deltaTime,
      ];
      if (!isColliding(newPosition)) {
        setPosition(newPosition);
      }
    }
    // Calculate the rotation for left movement
    if (movement.left) {
      setRotation((prevRotation) => prevRotation + rotationSpeed * deltaTime);
    }
    // Calculate the rotation for right movement
    if (movement.right) {
      setRotation((prevRotation) => prevRotation - rotationSpeed * deltaTime);
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
    const roomSize = 10
    // Check collision with walls and windows
    if (
      newPosition[0] < -roomSize / 2 + collisionRadius ||
      newPosition[0] > roomSize / 2 - collisionRadius ||
      newPosition[2] < -roomSize / 2 + collisionRadius ||
      newPosition[2] > roomSize / 2 - collisionRadius
    ) {
      return true;
    }

    // Add more collision detection logic as needed for other objects in the room

    return false;
  };

  return (
    <group >
    <mesh position={position} rotation={[0, rotation, 0]} scale={1}>
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

export default VirtualModel;