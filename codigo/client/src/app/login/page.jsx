'use client';
import React, { useState } from 'react'; // Importe o useState
import { TextInput, Button, Group, Notification } from '@mantine/core';
import '../globals.css';
import './login.css';
import { useRouter } from 'next/navigation';


const LoginPage = () => {

  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [notification, setNotification] = useState(null);
  const router = useRouter(); // Inicialize o useRouter

  const handleLogin = async () => {
    try {
          console.log('Dados de login:', { login, senha }); // Verifique se os dados estão corretos
          const response = await axios.post('http://localhost:8080/api/login', { login, senha });
          console.log('Resposta da API:', response); // Verifique a resposta da API
      
      
      if (response.status === 200) {
        const { tipoUsuario, idUsuario } = response.data;
        // Redirecionar para a página correta com base no tipo de usuário
        router.push(`/${tipoUsuario}?id=${idUsuario}`); 
      } else {
        setNotification({ message: response.data.error, color: 'red' });
      }
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setNotification({ message: 'Erro ao fazer login. Tente novamente.', color: 'red' });
    }
  };

  return (
    <div className="login-container">
      <h1 className="login-title">ENTRE COM SEU USUÁRIO E SENHA</h1>
      <style>
        
      </style>
      <form className="login-form" onSubmit={(e) => { 
        e.preventDefault(); // Previne o recarregamento da página
        handleLogin();}}> 
        <TextInput 
          label="Usuário"
          placeholder="Usuário"
          icon={<i className="fas fa-user"></i>} // ícone do usuário
          required
          className="input-field"
        />
        <TextInput 
          label="Senha"
          placeholder="Senha"
          icon={<i className="fas fa-lock"></i>} // ícone de senha
          type="password"
          required
          className="input-field"
        />
        <Button className="login-button" fullWidth>
          LOGIN
        </Button>
        <Group position="apart" className="login-links">
          <a href="#" className="link">Primeiro acesso? Cadastre-se aqui</a>
          <a href="#" className="link">Esqueci minha senha</a>
        </Group>
      </form>
    </div>
  );
};

export default LoginPage;