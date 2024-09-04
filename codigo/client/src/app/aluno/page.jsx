'use client';
import React, { useState, useEffect } from 'react';
import { Container, Button, Group, Box, TextInput, Notification, Radio, Select } from '@mantine/core';
import axios from 'axios';

const Cadastro = () => {
  const [tipoUsuario, setTipoUsuario] = useState('aluno');
  const [nome, setNome] = useState('');
  const [matricula, setMatricula] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [notification, setNotification] = useState({ message: '', color: '' });
  const [cursos, setCursos] = useState([]);  // Novo estado para cursos
  const [cursoSelecionado, setCursoSelecionado] = useState(''); // Novo estado para o curso selecionado

  // Função para gerar matrícula aleatória de 8 dígitos
  const gerarMatriculaAleatoria = () => {
    return Math.floor(10000000 + Math.random() * 90000000).toString();
  };

  useEffect(() => {
    if (tipoUsuario === 'aluno') {
      setMatricula(gerarMatriculaAleatoria()); // Gera uma matrícula ao selecionar 'Aluno'
    } else {
      setMatricula(''); // Limpa a matrícula se for professor
    }
  }, [tipoUsuario]);

  useEffect(() => {
    if (tipoUsuario === 'aluno') {
      // Busca os cursos disponíveis ao selecionar 'Aluno'
      axios.get('http://localhost:8080/api/get_cursos')
        .then((response) => {
          setCursos(response.data.cursos);
        })
        .catch((error) => {
          console.error('Erro ao buscar cursos:', error);
          setNotification({ message: 'Erro ao carregar cursos.', color: 'red' });
        });
    } else {
      setCursos([]); // Limpa os cursos se for professor
      setCursoSelecionado(''); // Limpa a seleção de curso se for professor
    }
  }, [tipoUsuario]);

  const handleCadastro = async () => {
    try {
      // 1. Cadastrar o usuário geral
      const novoUsuarioResponse = await axios.post('http://localhost:8080/api/add_usuario', { login, senha });
      const usuarioId = novoUsuarioResponse.data.idUsuario;
  
      let dadosCadastro = {
        nome,
        Usuario_idUsuario: usuarioId
      };
  
      if (tipoUsuario === 'aluno') {
        dadosCadastro.matricula = matricula;
        const novoAlunoResponse = await axios.post('http://localhost:8080/api/add_aluno', dadosCadastro);
        const alunoId = novoAlunoResponse.data.idAluno; // Captura o idAluno retornado
  
        // 2. Associar o aluno ao curso selecionado
        await axios.post('http://localhost:8080/api/alocar_aluno_curso', {
          Aluno_idAluno: alunoId, // Usa o idAluno capturado aqui
          Curso_idCurso: cursoSelecionado
        });
  
        setNotification({ message: 'Aluno cadastrado e alocado ao curso com sucesso!', color: 'green' });
      } else if (tipoUsuario === 'professor') {
        await axios.post('http://localhost:8080/api/add_professor', dadosCadastro);
        setNotification({ message: 'Professor cadastrado com sucesso!', color: 'green' });
      }
  
      // Limpar os campos após o cadastro bem-sucedido
      setNome('');
      setMatricula(tipoUsuario === 'aluno' ? gerarMatriculaAleatoria() : '');
      setLogin('');
      setSenha('');
      setCursoSelecionado(''); // Limpa a seleção de curso
  
    } catch (error) {
      console.error('Erro ao cadastrar:', error);
      let mensagemErro = 'Erro ao cadastrar. Verifique os dados.';
      if (error.response && error.response.data && error.response.data.error) {
        mensagemErro = error.response.data.error;
      }
      setNotification({ message: mensagemErro, color: 'red' });
    }
  };
  

  return (
    <Container style={{ marginTop: '30px', maxWidth: '400px' }}>
      <Box sx={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <h2>Cadastro</h2>

        <Radio.Group
          label="Tipo de Usuário"
          value={tipoUsuario}
          onChange={setTipoUsuario}
          mb="sm"
        >
          <Radio value="aluno" label="Aluno" />
          <Radio value="professor" label="Professor" />
        </Radio.Group>

        <TextInput
          label="Login"
          placeholder="Digite o login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          mb="sm"
        />

        <TextInput
          label="Nome"
          placeholder="Digite o nome" 
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          mb="sm"
        />

        {tipoUsuario === 'aluno' && (
          <Select
            label="Curso"
            placeholder="Selecione um curso"
            data={cursos.map((curso) => ({
              value: curso.idCurso.toString(),
              label: curso.nomeCurso
            }))}
            value={cursoSelecionado}
            onChange={setCursoSelecionado}
            mb="sm"
          />
        )}

        <TextInput 
          label="Senha"
          placeholder="Digite a senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          type="password" 
          mb="sm"
        />

        <Group position="right" mt="md">
          <Button onClick={handleCadastro} color="green">Cadastrar</Button>
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

export default Cadastro;
