import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ExpensePage } from './pages/ExpensePage';
import { Login } from './pages/Login';
import {Register} from './pages/Register';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<ExpensePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
