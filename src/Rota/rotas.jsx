// src/Rotas/Rotas.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../Dashboard';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import Noticias from '../pages/Noticias';
import Perfil from '../pages/Perfil';
import PrivateRoute from '../PrivateRoute';
import PublicRoute from '../PublicRoute';
import RedefinirSenha from '../pages/RedefinirSenha';
import AtualizarSenha from '../pages/AtualizarSenha';

export default function Rotas() {
  return (
    <Routes>
      {/* Página inicial pública */}
      <Route path="/" element={<Dashboard />} />

      {/* Página de perfil protegida */}
      <Route
        path="/perfil"
        element={
          <PrivateRoute>
            <Perfil />
          </PrivateRoute>
        }
      />

      {/* Login e cadastro protegidos por PublicRoute */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/cadastro"
        element={
          <PublicRoute>
            <Cadastro />
          </PublicRoute>
        }
        
      />
      <Route
        path="/redefinir-senha"
        element={
          <PublicRoute>
            <RedefinirSenha />
          </PublicRoute>
        }
      />
      <Route
        path="/atualizar-senha"
        element={
          <PrivateRoute>
            <AtualizarSenha />
          </PrivateRoute>
        }
      />

      {/* Página de notícias (pública) */}
      <Route path="/noticias" element={<Noticias />} />

      {/* Redirecionamento de rota inválida */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
