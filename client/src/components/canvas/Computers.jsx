import React, { useEffect, useRef , useState } from 'react';
import { Canvas ,useFrame} from '@react-three/fiber';
import { Physics, useBox, usePlane } from '@react-three/cannon';
import { OrbitControls, Preload, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import VirtualModels from './VirtualModels';
import Room from './Room';


const ComputersCanvas = () => {
  return (
    <Canvas camera={{ position: [0, 5, 10], fov: 60 }} shadowMap style={{ height: '100vh', width: '100%' }}>
      <Room scale={0.5} position={[0, -1, 0]} />
      <Preload />
      <VirtualModels />
    </Canvas>
  );
};

export default ComputersCanvas;