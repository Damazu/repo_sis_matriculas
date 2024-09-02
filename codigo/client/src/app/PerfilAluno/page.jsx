'use client';
import React, { useState, useEffect } from 'react';
import { Container, Loader, Table, Box, Notification, Title, Button, Group, Select, Modal } from '@mantine/core';
import axios from 'axios';

const PerfilAluno = () => {
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [disciplinas, setDisciplinas] = useState([]);
  const [todasDisciplinas, setTodasDisciplinas] = useState([]); // Todas as disciplinas disponíveis
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', color: '' });
  const [opened, setOpened] = useState(false); // Estado para controlar o modal
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState(null); // Disciplina selecionada para adicionar

  useEffect(() => {
    // Busca os dados dos alunos
    axios.get('http://localhost:8080/api/get_alunos')
      .then((response) => {
        setAlunos(response.data.alunos);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar alunos:', error);
        setNotification({ message: 'Erro ao carregar dados dos alunos.', color: 'red' });
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (alunoSelecionado) {
      // Busca as disciplinas do aluno selecionado
      axios.get(`http://localhost:8080/api/get_disciplinas_aluno/${alunoSelecionado.idAluno}`)
        .then((response) => {
          setDisciplinas(response.data.disciplinas);
        })
        .catch((error) => {
          console.error('Erro ao buscar disciplinas do aluno:', error);
          setNotification({ message: 'Erro ao carregar disciplinas do aluno.', color: 'red' });
        });

      // Busca todas as disciplinas disponíveis
      axios.get('http://localhost:8080/api/get_disciplinas')
        .then((response) => {
          setTodasDisciplinas(response.data.disciplinas);
        })
        .catch((error) => {
          console.error('Erro ao buscar todas as disciplinas:', error);
          setNotification({ message: 'Erro ao carregar todas as disciplinas.', color: 'red' });
        });
    }
  }, [alunoSelecionado]);

  const handleSelectChange = (idAluno) => {
    const aluno = alunos.find(a => a.idAluno === parseInt(idAluno, 10));
    setAlunoSelecionado(aluno);
    setDisciplinas([]); // Limpa as disciplinas ao selecionar um novo aluno
  };

  const handleDesvincular = (idDisciplinas) => {
    axios.delete(`http://localhost:8080/api/delete_disciplina_aluno`, {
      data: {
        idAluno: alunoSelecionado.idAluno,
        idDisciplinas: idDisciplinas
      }
    })
    .then(() => {
      setNotification({ message: 'Disciplina desvinculada com sucesso!', color: 'green' });
      setDisciplinas(disciplinas.filter(disciplina => disciplina.idDisciplinas !== idDisciplinas));
    })
    .catch((error) => {
      console.error('Erro ao desvincular a disciplina:', error);
      setNotification({ message: 'Erro ao desvincular a disciplina. Tente novamente.', color: 'red' });
    });
  };

  const handleDeletarAluno = () => {
    if (!alunoSelecionado) return;

    axios.delete(`http://localhost:8080/api/delete_aluno/${alunoSelecionado.idAluno}`)
      .then(() => {
        setNotification({ message: 'Aluno deletado com sucesso!', color: 'green' });
        setAlunos(alunos.filter(aluno => aluno.idAluno !== alunoSelecionado.idAluno));
        setAlunoSelecionado(null);
        setDisciplinas([]);
      })
      .catch((error) => {
        console.error('Erro ao deletar o aluno:', error);
        setNotification({ message: 'Erro ao deletar o aluno. Tente novamente.', color: 'red' });
      });
  };

  const handleAdicionarDisciplina = () => {
    if (!disciplinaSelecionada) return;

    axios.post(`http://localhost:8080/api/matricular_aluno`, {
      idAluno: alunoSelecionado.idAluno,
      disciplinas: [disciplinaSelecionada]
    })
    .then(() => {
      setNotification({ message: 'Disciplina adicionada com sucesso!', color: 'green' });
      setDisciplinas([...disciplinas, todasDisciplinas.find(d => d.idDisciplinas === parseInt(disciplinaSelecionada))]);
      setOpened(false);
      setDisciplinaSelecionada(null);
    })
    .catch((error) => {
      console.error('Erro ao adicionar a disciplina:', error);
      setNotification({ message: 'Erro ao adicionar a disciplina. Tente novamente.', color: 'red' });
    });
  };

  return (
    <Container style={{ marginTop: '30px', maxWidth: '800px' }}>
      <Box sx={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <Title order={2} mb="md">Perfil dos Alunos</Title>
        
        {loading ? (
          <Loader size="lg" />
        ) : (
          <>
            <Select
              label="Selecione um aluno"
              placeholder="Escolha um aluno"
              data={alunos.map((aluno) => ({
                value: aluno.idAluno.toString(),
                label: aluno.nome
              }))}
              onChange={handleSelectChange}
            />

            {alunoSelecionado && (
              <>
                <Table striped highlightOnHover mt="md">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Matrícula</th>
                      <th>ID do Usuário</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{alunoSelecionado.idAluno}</td>
                      <td>{alunoSelecionado.nome}</td>
                      <td>{alunoSelecionado.matricula}</td>
                      <td>{alunoSelecionado.Usuario_idUsuario}</td>
                    </tr>
                  </tbody>
                </Table>

                <Title order={4} mt="md">Disciplinas Matriculadas</Title>
                <Table striped highlightOnHover mt="md">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Nome</th>
                      <th>Aberto para Matrícula</th>
                      <th>Número de Créditos</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {disciplinas.length > 0 ? (
                      disciplinas.map((disciplina) => (
                        <tr key={disciplina.idDisciplinas}>
                          <td>{disciplina.idDisciplinas}</td>
                          <td>{disciplina.nome}</td>
                          <td>{disciplina.abertoMatricula ? 'Sim' : 'Não'}</td>
                          <td>{disciplina.numCreditos}</td>
                          <td>
                            <Button color="red" onClick={() => handleDesvincular(disciplina.idDisciplinas)}>
                              Desvincular
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center' }}>Nenhuma disciplina matriculada</td>
                      </tr>
                    )}
                  </tbody>
                </Table>

                <Group position="center" mt="md">
                  <Button color="green" onClick={() => setOpened(true)}>
                    Novo
                  </Button>
                  <Button color="red" onClick={handleDeletarAluno}>
                    Deletar Aluno
                  </Button>
                </Group>
              </>
            )}
          </>
        )}

        {notification.message && (
          <Notification color={notification.color} mt="md">
            {notification.message}
          </Notification>
        )}
      </Box>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Adicionar Nova Disciplina"
      >
        <Select
          label="Selecione uma disciplina"
          placeholder="Escolha uma disciplina"
          data={todasDisciplinas.map((disciplina) => ({
            value: disciplina.idDisciplinas.toString(),
            label: disciplina.nome
          }))}
          onChange={setDisciplinaSelecionada}
        />

        <Group position="right" mt="md">
          <Button color="green" onClick={handleAdicionarDisciplina}>
            Adicionar
          </Button>
        </Group>
      </Modal>
    </Container>
  );
};

export default PerfilAluno;
