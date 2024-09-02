'use client';
import React, { useState, useEffect } from 'react';
import { Container, Loader, Table, Box, Notification, Title, Select, Button, Group } from '@mantine/core';
import axios from 'axios';
import "./PerfilAluno.css"

const PerfilAluno = () => {
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [disciplinas, setDisciplinas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', color: '' });

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
    }
  }, [alunoSelecionado]);

  const handleSelectChange = (idAluno) => {
    const aluno = alunos.find(a => a.idAluno === parseInt(idAluno, 10));
    setAlunoSelecionado(aluno);
    setDisciplinas([]); // Limpa as disciplinas ao selecionar um novo aluno
  };

  const handleDesmatricular = (idDisciplinas) => {
    axios.delete(`http://localhost:8080/api/delete_disciplina_aluno`, {
      data: {
        idAluno: alunoSelecionado.idAluno,
        idDisciplinas: idDisciplinas
      }
    })
    .then(() => {
      setNotification({ message: 'Disciplina desmatriculada com sucesso!', color: 'green' });
      setDisciplinas(disciplinas.filter(disciplina => disciplina.idDisciplinas !== idDisciplinas));
    })
    .catch((error) => {
      console.error('Erro ao desmatricular a disciplina:', error);
      setNotification({ message: 'Erro ao desmatricular a disciplina. Tente novamente.', color: 'red' });
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
                      <th>Nome</th>
                      <th>Matrícula</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{alunoSelecionado.nome}</td>
                      <td>{alunoSelecionado.matricula}</td>
                    </tr>
                  </tbody>
                </Table>
                <Button color="red" onClick={() => handleDesmatricular(disciplina.idDisciplinas)}>
                              Desmatricular
                            </Button>
                <Title order={4} mt="md">Disciplinas Matriculadas</Title>
                <Table striped highlightOnHover mt="md">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Aberto para Matrícula</th>
                      <th>Número de Créditos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {disciplinas.length > 0 ? (
                      disciplinas.map((disciplina) => (
                        <tr key={disciplina.idDisciplinas}>
                          <td>{disciplina.nome}</td>
                          <td>{disciplina.abertoMatricula ? 'Sim' : 'Não'}</td>
                          <td>{disciplina.numCreditos}</td>
                          <td>
                            
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
    </Container>
  );
};

export default PerfilAluno;
