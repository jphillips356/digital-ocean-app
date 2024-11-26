// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import './App.css';

// import LoginPage from './pages/LoginPage';

// function App() {
//   return (
//     <BrowserRouter>
//       <Routes>
//         <Route path="/" element={<LoginPage />} />
//       </Routes>
//     </BrowserRouter>
//       );
// }

// export default App;

// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';

import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

