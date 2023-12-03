import 'bootstrap/dist/css/bootstrap.min.css'

import {Home} from './Pages/Home/Home';
import {Draft} from './Pages/Draft/Draft';
import {Navigation} from './Pages/Navigation';

import {BrowserRouter, Route, Routes} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    <div className="container ">
      <h3 className="m-3 d-flex justify-content-center">
        MTG Cube Simulator
      </h3>
      <Navigation/>
      <Routes>
        <Route path='/' element={<Home />} exact/>
        <Route path='/draft' element={<Draft />} exact/>
      </Routes>
    </div>
    </BrowserRouter>
  )
}

export default App
