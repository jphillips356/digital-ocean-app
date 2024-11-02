import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Default route */}
        <Route path="/login" element={<LoginPage />} /> {/* Login page */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
