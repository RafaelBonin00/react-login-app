// src/Dashboard.jsx
import { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import { Link} from 'react-router-dom';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  if (!user) return (
    <>
      <Link to="/noticias">Noticias</Link>
      <p>
          Já tem conta? <Link to="/login">Entrar</Link>
      </p>
      <p>
          Não tem conta? <Link to="/cadastro">Cadastrar</Link>
      </p>
    </>
   
  
  );

  return (
    <div>
      <h2>Bem-vindo, {user.email}</h2>
      <button onClick={handleLogout}>Sair</button>
    </div>
  );
}
