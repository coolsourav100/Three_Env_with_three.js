import React from 'react';

import ComputersCanvas  from './canvas/Computers';

const Hero = () => {
  return (
    <section className='relative w-full h-screen mx-auto'>
      <div className=''>
        <div className='flex flex-col justify-center items-center mt-5'>
        <div className='w-5 h-5 rounded-full bg-[#915eff]'/>
        <div className='w-1 sm:h-80 h-40 violet-gradient'>

        </div>
        </div>
        <div>
          <h1 className=''>Hi , I'm <span className='text-[#915eff]'>   Sourav </span></h1>
          <p className=''> Welcome to the 3D Environment<br className="sm:block hidden"/></p>
        </div>
      </div>
    <ComputersCanvas/>
    </section>
  )
}

export default Hero