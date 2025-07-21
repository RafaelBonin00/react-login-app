// src/Rotas/Rotas.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../Dashboard';
import Login from '../pages/Login';
import Cadastro from '../pages/Cadastro';
import Noticias from '../pages/Noticias';
import Perfil from '../pages/Perfil';
import RedefinirSenha from '../pages/RedefinirSenha';
import AtualizarSenha from '../pages/AtualizarSenha';
import AuthRoute from '../AuthRoute';

export default function Rotas() {
  return (
    <Routes>
      {/* Página inicial pública */}
      <Route path="/" element={<Dashboard />} />

      {/* Página de perfil protegida */}
      <Route
        path="/perfil"
        element={
          <AuthRoute type="private">
            <Perfil />
          </AuthRoute>
        }
      />

      {/* Login e cadastro protegidos por PublicRoute */}
      <Route
        path="/login"
        element={
          <AuthRoute type="public">
            <Login />
          </AuthRoute>
        }
      />
      <Route
        path="/cadastro"
        element={
          <AuthRoute type="public">
            <Cadastro />
          </AuthRoute>
        }
        
      />
      <Route
        path="/redefinir-senha"
        element={
          <AuthRoute type="public">
            <RedefinirSenha />
          </AuthRoute>
        }
      />
      <Route
        path="/atualizar-senha"
        element={
          <AuthRoute type="private">
            <AtualizarSenha />
          </AuthRoute>
        }
      />

      {/* Página de notícias (pública) */}
      <Route path="/noticias" element={<Noticias />} />

      {/* Redirecionamento de rota inválida */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
