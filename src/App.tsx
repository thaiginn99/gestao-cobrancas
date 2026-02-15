import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import { Toaster } from "@/components/ui/toaster";

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Monitora o estado da autenticação em tempo real
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center">Carregando sistema...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Se o usuário estiver logado, vai para o Index; senão, Login */}
        <Route 
          path="/" 
          element={user ? <Index /> : <Navigate to="/login" replace />} 
        />
        <Route 
          path="/login" 
          element={!user ? <Login /> : <Navigate to="/" replace />} 
        />
      </Routes>
      <Toaster />
    </BrowserRouter>
  );
};

export default App;