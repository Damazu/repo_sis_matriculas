'use client';
import React, { useState, useEffect } from 'react';
import { Container, Button, Group, Box, TextInput, Select, Notification } from '@mantine/core';
import axios from 'axios';

const CadastroAlunos = () => {
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [usuarioId, setUsuarioId] = useState('');
  const [usuariosDisponiveis, setUsuariosDisponiveis] = useState([]);
  const [notification, setNotification] = useState({ message: '', color: '' });

  // Busca usuários disponíveis ao carregar o componente
  useEffect(() => {
    axios.get('http://localhost:8080/api/get_usuarios_disponiveis')
      .then((response) => {
        setUsuariosDisponiveis(response.data.usuarios || []);
      })
      .catch((error) => {
        console.error('Erro ao buscar usuários disponíveis:', error);
      });
  }, []);

  const handleAddAluno = () => {
    const novoAluno = {
      nome,
      matricula,
      Usuario_idUsuario: parseInt(usuarioId, 10)
    };

    axios.post('http://localhost:8080/api/add_aluno', novoAluno)
      .then((response) => {
        setNome('');
        setMatricula('');
        setUsuarioId('');
        setNotification({ message: 'Aluno cadastrado com sucesso!', color: 'green' });
      })
      .catch((error) => {
        console.error('Erro ao adicionar aluno:', error);
        setNotification({ message: 'Erro ao cadastrar aluno. Verifique os dados.', color: 'red' });
      });
  };

  return (
    <Container style={{ marginTop: '30px', maxWidth: '400px' }}>
      <Box sx={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <h2>Cadastro de Aluno</h2>
        <TextInput
          label="Nome"
          placeholder="Digite o nome do aluno"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          mb="sm"
        />
        <TextInput
          label="Matrícula"
          placeholder="Digite a matrícula"
          value={matricula}
          onChange={(e) => setMatricula(e.target.value)}
          mb="sm"
        />
        <Select
          label="Usuário"
          placeholder="Selecione o usuário"
          data={usuariosDisponiveis.map((usuario) => ({
            value: usuario.idUsuario.toString(),
            label: usuario.login
          }))}
          value={usuarioId}
          onChange={setUsuarioId}
          
        />
        <Group position="right" mt="md">
          <Button onClick={handleAddAluno} color="green">Cadastrar</Button>
        </Group>
        {notification.message && (
          <Notification color={notification.color} mt="md">
            {notification.message}
          </Notification>
        )}
      </Box>
    </Container>
  );
};

export default CadastroAlunos;
