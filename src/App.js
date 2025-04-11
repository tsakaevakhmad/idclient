import logo from './logo.svg';
import './App.css';
import LoginTwoFa from './Components/LoginTwoFa';
import LoginTwoFaVerify from './Components/LoginTwoFaVerify';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginTwoFa />} />
        <Route path="/LoginTwoFaVerify/:id" element={<LoginTwoFaVerify />} /> 
      </Routes>
    </Router>
  );
}

export default App;
