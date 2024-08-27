import React from 'react';
import { TextInput, Button, Group } from '@mantine/core';
import './globals.css'; // Importando o CSS externo

const LoginPage = () => {
  return (
    <div className="login-container">
      <h1 className="login-title">ENTRE COM SEU USUÁRIO E SENHA</h1>
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
