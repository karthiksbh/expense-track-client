import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ExpensePage } from './pages/ExpensePage';
import { Login } from './pages/Login';
import {Register} from './pages/Register';
import { Insights } from './pages/Insights';
import { RequestPage } from './pages/RequestPage';
import { ReceiveRequests } from './pages/ReceiveRequests';

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<ExpensePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/request" element={<RequestPage />} />
          <Route path="/receive-request" element={<ReceiveRequests />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
