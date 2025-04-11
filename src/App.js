import logo from './logo.svg';
import './App.css';
import LoginTwoFa from './Components/LoginTwoFa';
import LoginTwoFaVerify from './Components/LoginTwoFaVerify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useParams, useNavigate } from 'react-router-dom';
import Login from './Components/Login';
import Profile from './Components/Profile';


function App() {
  const { params }= useParams();
  console.log(params);
  return (
    <Router>
      <Routes>
        <Route path="/LoginTwoFa" element={<LoginTwoFa />} />
        <Route path="/" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/LoginTwoFaVerify/:id" element={<LoginTwoFaVerify />} /> 
      </Routes>
    </Router>
  );
}

export default App;
