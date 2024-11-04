import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/login';
import Callback from './pages/callback';
import Main from './pages/main';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/main" element={<Main />} />
      </Routes>
      <ToastContainer />
    </Router>
  );
}

export default App;