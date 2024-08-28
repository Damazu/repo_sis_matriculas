import React from 'react';
import { TextInput, Button, Group } from '@mantine/core';
import '../globals.css'; // Importando o CSS externo

const LoginPage = () => {
  return (
    <div className="login-container">
      <h1 className="login-title">ENTRE COM SEU USUÁRIO E SENHA</h1>
      <style>
        {`
          .login-container {
            margin-top: 60px; /* Ajuste este valor de acordo com a altura da sua navbar */
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: calc(100vh - 60px); /* Garante que o conteúdo ocupe o espaço vertical restante */
          }

          .login-form {
            width: 100%; /* Ou defina uma largura fixa, como 300px */
            max-width: 400px; /* Limita a largura máxima do formulário */
          }

          .input-field {
            margin-bottom: 15px;
          }

          .login-button {
            margin-top: 20px;
          }

          .login-links {
            margin-top: 10px;
          }
        `}
      </style>
      <form className="login-form">
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
