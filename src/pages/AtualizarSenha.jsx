// src/pages/AtualizarSenha.jsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { Link, useNavigate } from 'react-router-dom';

export default function AtualizarSenha() {
  const [form, setForm] = useState({ password: '', confirmPassword: '' });
  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [sucesso, setSucesso] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'PASSWORD_RECOVERY') {
          setCarregando(false);
        }
      }
    );

    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        setCarregando(false);
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);

    if (name === 'password') {
      setPasswordChecks({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }
  };

  const senhaValida =
    passwordChecks.length &&
    passwordChecks.uppercase &&
    passwordChecks.number &&
    passwordChecks.special &&
    form.password === form.confirmPassword;

  const handleAtualizarSenha = async (e) => {
    e.preventDefault();
    setErro(null);
    setSucesso(null);

    if (!senhaValida) {
      setErro('A senha não atende aos requisitos.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: form.password });

    if (error) {
      setErro('Erro ao atualizar a senha: ' + error.message);
    } else {
      setSucesso('Senha atualizada com sucesso! Redirecionando...');
      setTimeout(() => navigate('/'), 1500);
    }
  };

  if (carregando) {
    return <p>Carregando sessão de redefinição...</p>;
  }

  return (
    <div>
      <Link to="/noticias">Noticias</Link>
      <h2>Atualizar Senha</h2>
      <form onSubmit={handleAtualizarSenha}>
        <input
          type="password"
          name="password"
          placeholder="Nova senha"
          value={form.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmar nova senha"
          value={form.confirmPassword}
          onChange={handleChange}
          required
        />
        <button type="submit">Atualizar</button>
      </form>

      {/* Requisitos da senha */}
      <div style={{ fontSize: '0.9em', marginTop: '10px' }}>
        <p>Requisitos da senha:</p>
        <ul>
          <li style={{ color: passwordChecks.length ? 'green' : 'red' }}>
            Mínimo de 8 caracteres
          </li>
          <li style={{ color: passwordChecks.uppercase ? 'green' : 'red' }}>
            Pelo menos uma letra maiúscula
          </li>
          <li style={{ color: passwordChecks.number ? 'green' : 'red' }}>
            Pelo menos um número
          </li>
          <li style={{ color: passwordChecks.special ? 'green' : 'red' }}>
            Pelo menos um caractere especial
          </li>
          <li
            style={{
              color:
                form.password && form.confirmPassword && form.password === form.confirmPassword
                  ? 'green'
                  : 'red',
            }}
          >
            Senha e confirmação iguais
          </li>
        </ul>
      </div>

      {/* Mensagens */}
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}
      <p>
        Lembrou da senha? <Link to="/">Entrar</Link>
      </p>
    </div>
  );
}
