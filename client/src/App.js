import logo from './logo.svg';
import './App.css';
import { Canvas } from '@react-three/fiber'
import VirtualEnvironment from './Component/VirtualEnvironment/VirtualEnvironment';


function App() {
  return (
     
      <div className='virtualEnv'>
      <h1>Virtual Environment</h1>
      <VirtualEnvironment/>
      </div>
    
  )
}

export default App;
