import './App.css';
import Signup from './components/Signup';
import Login from './components/Login';
import Home from './components/Home';
import Item from './components/Item';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/add-item" element={<Item />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
