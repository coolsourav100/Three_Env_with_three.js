import { Canvas } from '@react-three/fiber'
import React from 'react'
import { Box } from '@react-three/drei';

const VirtualEnvironment = () => {
  return (
    <Canvas>
    <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <mesh>
      <Box position={[-1.2, 0, 0]} />
      <Box position={[1.2, 0, 0]} />
      </mesh>
    </Canvas>
  )
}

export default VirtualEnvironment