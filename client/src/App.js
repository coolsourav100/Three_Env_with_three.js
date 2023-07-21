import { BrowserRouter, Route , Routes} from "react-router-dom";
import './App.css';
import Home from './Page/Home'
import Login from './Page/Login'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  
  return (
    <div className="App">
      
      <BrowserRouter>
   <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/home" element={<Home/>}/>
      </Routes>
   </BrowserRouter>
    </div>
  );
}

export default App;
