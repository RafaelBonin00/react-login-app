import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';

export default function Cadastro() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
  });

  const [touched, setTouched] = useState({});
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const [passwordChecks, setPasswordChecks] = useState({
    length: false,
    uppercase: false,
    number: false,
    special: false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === 'password') {
      setPasswordChecks({
        length: value.length >= 8,
        uppercase: /[A-Z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value),
      });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });

    const errorMessage = validateField(name, value);
    if (errorMessage) setError(errorMessage);
    else setError(null);
  };

  const validateField = (name, value) => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'O primeiro nome é obrigatório';
        break;
      case 'lastName':
        if (!value.trim()) return 'O sobrenome é obrigatório';
        break;
      case 'email':
        if (!value.includes('@')) return 'Email inválido';
        break;
      case 'confirmEmail':
        if (value !== form.email) return 'Os e-mails não coincidem';
        break;
      case 'password':
        if (value.length < 8) return 'A senha deve ter pelo menos 8 caracteres';
        break;
      case 'confirmPassword':
        if (value !== form.password) return 'As senhas não coincidem';
        break;
      default:
        return '';
    }
    return '';
  };

  const validateForm = () => {
    const allValid =
      form.firstName.trim() !== '' &&
      form.lastName.trim() !== '' &&
      form.email.includes('@') &&
      form.email === form.confirmEmail &&
      form.password === form.confirmPassword &&
      Object.values(passwordChecks).every(Boolean);

    setIsFormValid(allValid);
  };

  useEffect(() => {
    validateForm();
  }, [form, passwordChecks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          firstName: form.firstName,
          lastName: form.lastName,
        },
      },
    });

    if (signUpError) {
      setError('Erro ao cadastrar: ' + signUpError.message);
      setIsSubmitting(false);
      return;
    }

    const userId = data?.user?.id;

    if (!userId) {
      setError('Usuário não foi criado corretamente. Verifique seu email.');
      setIsSubmitting(false);
      return;
    }

    // (Opcional) Se estiver usando tabela 'profiles'
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(
        [{
          id: userId,
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
        }],
        { onConflict: ['id'] }
      );

    if (profileError) {
      setError('Erro ao salvar perfil: ' + profileError.message);
      setIsSubmitting(false);
      return;
    }

    setSuccess('Conta criada com sucesso! Por favor, confirme seu e-mail para realizar o acesso.');
    setIsSubmitting(false);
  };

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <Link to="/noticias">Notícias</Link>
      <h2>Cadastrar</h2>

      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        <input
          name="firstName"
          placeholder="Primeiro nome"
          value={form.firstName}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        <input
          name="lastName"
          placeholder="Sobrenome"
          value={form.lastName}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        <input
          name="confirmEmail"
          type="email"
          placeholder="Confirmar email"
          value={form.confirmEmail}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Senha"
          value={form.password}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        <input
          name="confirmPassword"
          type="password"
          placeholder="Confirmar senha"
          value={form.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />

        <div style={{ fontSize: '0.9em' }}>
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
                  form.password &&
                  form.confirmPassword &&
                  form.password === form.confirmPassword
                    ? 'green'
                    : 'red',
              }}
            >
              Senha e confirmação iguais
            </li>
          </ul>
        </div>

        <button type="submit" disabled={!isFormValid || isSubmitting}>
          Cadastrar
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      <p>
        Já tem conta? <Link to="/login">Entrar</Link>
      </p>
    </div>
  );
}
