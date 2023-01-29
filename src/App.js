import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import TokenData from './components/TokenData';

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/token/:tokenName' element={<TokenData />}>Student</Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
