import React, { useEffect, useRef , useState } from 'react';
import {useGLTF } from '@react-three/drei';


const Model = (props) => {
  const { nodes } = useGLTF("./other.glb");
  useEffect(()=>{

  },[props.position])
  console.log(props)
  
  return (
    <mesh position={props.position} rotation={[0, props.rotation, 0]} scale={1}>
      <primitive object={nodes.Scene} />
      </mesh>
    
  );
};

export default Model;