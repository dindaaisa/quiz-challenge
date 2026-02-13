// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import authService from './services/authService';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import QuizIntroPage from './pages/QuizIntroPage';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';

const ProtectedRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        <Route 
          path="/intro" 
          element={
            <ProtectedRoute>
              <QuizIntroPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/quiz" 
          element={
            <ProtectedRoute>
              <QuizPage />
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/result" 
          element={
            <ProtectedRoute>
              <ResultPage />
            </ProtectedRoute>
          } 
        />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;