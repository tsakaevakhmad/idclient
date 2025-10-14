import './App.css';
import LoginTwoFa from './Components/Login/LoginTwoFa';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './Components/Login/Login';
import Profile from './Components/Profile';
import Registration from './Components/Login/Registration';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/LoginTwoFa" element={<LoginTwoFa />} />
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/registration" element={<Registration />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
