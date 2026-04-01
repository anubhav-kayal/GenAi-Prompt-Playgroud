import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';

// Import components
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ChatArea from './components/ChatArea';
import CodeAnalyzer from './components/CodeAnalyzer';
import Billing from './components/Billing';
import Settings from './components/Settings';
import Login from './components/Login';
import Landing from './components/Landing';
import Profile from './components/Profile';

// 🛡️ AUTHENTICATION GUARDS
const ProtectedRoute = ({ children, user, loading }) => {
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

const PublicRoute = ({ children, user, loading }) => {
  if (loading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function App() {
  const [authUser, setAuthUser] = useState(auth.currentUser);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthUser(user);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        
        {/* UNIVERSAL ENTRY POINT */}
        <Route path="/" element={<Landing />} />

        {/* AUTHENTICATION */}
        <Route 
          path="/login" 
          element={
            <PublicRoute user={authUser} loading={isAuthLoading}>
              <Login />
            </PublicRoute>
          } 
        />

        {/* PROTECTED APPLICATION SHELL */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute user={authUser} loading={isAuthLoading}>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* path: /dashboard */}
          <Route index element={<Dashboard />} />
          
          {/* path: /dashboard/playground */}
          <Route path="playground" element={<ChatArea />} />

           {/* path: /dashboard/profile */}
          <Route path="profile" element={<Profile />} />

          {/* path: /dashboard/code-analyzer */}
          <Route path="code-analyzer" element={<CodeAnalyzer />} />

          {/* path: /dashboard/billing */}
          <Route path="billing" element={<Billing />} />
          
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