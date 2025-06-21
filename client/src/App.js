import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MedicationForm from './components/MedicationForm';
import { useState } from 'react';

function App() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem('token'));

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={loggedIn ? <Dashboard /> : <Login setLoggedIn={setLoggedIn} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/MedicationFrom" element={<MedicationForm/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
