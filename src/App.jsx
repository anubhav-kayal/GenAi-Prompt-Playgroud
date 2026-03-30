import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Import components
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ChatArea from './components/ChatArea';
import CodeAnalyzer from './components/CodeAnalyzer';
import Settings from './components/Settings';
import Login from './components/Login';
import Landing from './components/Landing';

// 🛡️ AUTHENTICATION GUARDS
const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('nexus_user');
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children }) => {
  const user = localStorage.getItem('nexus_user');
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        {/* UNIVERSAL ENTRY POINT */}
        <Route path="/" element={<Landing />} />

        {/* AUTHENTICATION */}
        <Route 
          path="/login" 
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } 
        />

        {/* PROTECTED APPLICATION SHELL */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* path: /dashboard */}
          <Route index element={<Dashboard />} />
          
          {/* path: /dashboard/playground */}
          <Route path="playground" element={<ChatArea />} />
          
          {/* path: /dashboard/code-analyzer */}
          <Route path="code-analyzer" element={<CodeAnalyzer />} />
          
          {/* path: /dashboard/settings */}
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* GLOBAL CATCH-ALL: Prevents broken links from showing a white screen */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;