import React from 'react';

import ComputersCanvas  from './canvas/Computers';
import VirtualModels from './canvas/VirtualModels';
import { useNavigate } from 'react-router-dom';

const Hero = () => {
  
  const navigate = useNavigate()
  const logoutHandler=()=>{
    localStorage.clear()
  navigate('/')
  }
  return (
    <section className='relative w-full h-screen mx-auto'>
      <div className=''>
      <div className='flex jusity-end'><button className='btn btn-danger' onClick={logoutHandler}>Logout</button></div>
        <div className='flex flex-col justify-center items-center mt-5'>
        <div className='w-5 h-5 rounded-full bg-[#915eff]'/>
        <div className='w-1 sm:h-80 h-40 violet-gradient'>

        </div>
        </div>
        <div>
          
          <p className=''> Welcome to the 3D Environment<br className="sm:block hidden"/></p>
        </div>
      </div>
    <VirtualModels/>
    </section>
  )
}

export default Hero