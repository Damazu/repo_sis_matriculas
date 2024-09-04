'use client'
import React, { useState, useEffect } from 'react';
import { Container, Loader, Table, Box, Notification, Title, Select, Button, Group } from '@mantine/core';
import axios from 'axios';
import "./PerfilAluno.css"

const PerfilAluno = () => {
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [disciplinas, setDisciplinas] = useState([]);
  const [todasDisciplinas, setTodasDisciplinas] = useState([]); // Para armazenar todas as disciplinas disponíveis para o curso
  const [curso, setCurso] = useState(null); 
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
      setLoading(true);
      // Busca o curso do aluno selecionado
      axios.get(`http://localhost:8080/api/get_curso_aluno/${alunoSelecionado.idAluno}`)
        .then((response) => {
          if (response.data.curso) {
            setCurso(response.data.curso);
            // Busca todas as disciplinas associadas ao curso do aluno (disponíveis e não matriculadas)
            return axios.get(`http://localhost:8080/api/get_disciplinas_by_curso/${response.data.curso.idCurso}`);
          } else {
            throw new Error('Curso não encontrado para o aluno selecionado.');
          }
        })
        .then((response) => {
          setTodasDisciplinas(response.data.disciplinas); // Todas as disciplinas disponíveis para o curso
          // Agora busca as disciplinas que o aluno já está matriculado
          return axios.get(`http://localhost:8080/api/get_disciplinas_aluno/${alunoSelecionado.idAluno}`);
        })
        .then((response) => {
          setDisciplinas(response.data.disciplinas); // Disciplinas já matriculadas
          setLoading(false);
        })
        .catch((error) => {
          console.error('Erro ao buscar curso ou disciplinas do aluno:', error);
          setNotification({ message: 'Erro ao carregar curso ou disciplinas do aluno.', color: 'red' });
          setLoading(false);
        });
    }
  }, [alunoSelecionado]);

  const handleSelectChange = (idAluno) => {
    const aluno = alunos.find(a => a.idAluno === parseInt(idAluno, 10));
    setAlunoSelecionado(aluno);
    setDisciplinas([]); // Limpa as disciplinas ao selecionar um novo aluno
    setCurso(null); // Limpa o curso ao selecionar um novo aluno
  };

  const handleVincularDisciplina = (idDisciplinas) => {
    axios.post('http://localhost:8080/api/matricular_aluno', {
      idAluno: alunoSelecionado.idAluno,
      disciplinas: [idDisciplinas] // Vincula apenas uma disciplina
    })
    .then(() => {
      setNotification({ message: 'Disciplina vinculada com sucesso!', color: 'green' });
      // Atualiza as disciplinas já matriculadas
      setDisciplinas([...disciplinas, todasDisciplinas.find(d => d.idDisciplinas === idDisciplinas)]);
    })
    .catch((error) => {
      console.error('Erro ao vincular disciplina:', error);
      setNotification({ message: 'Erro ao vincular disciplina. Tente novamente.', color: 'red' });
    });
  };

  const handleDesmatricular = (idDisciplinas) => {
    axios.delete('http://localhost:8080/api/delete_disciplina_aluno', {
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
                
                {curso && (
                  <>
                    <Title order={4} mt="md">Curso: {curso.nomeCurso}</Title>
                    
                    {/* Botão para Vincular Nova Disciplina */}
                    <Title order={4} mt="md">Vincular Nova Disciplina</Title>
                    <Select
                      label="Disciplinas Disponíveis"
                      placeholder="Escolha uma disciplina para vincular"
                      data={todasDisciplinas
                        .filter(d => !disciplinas.find(m => m.idDisciplinas === d.idDisciplinas))
                        .map((disciplina) => ({
                          value: disciplina.idDisciplinas.toString(),
                          label: disciplina.nome
                        }))}
                      onChange={(idDisciplinas) => handleVincularDisciplina(parseInt(idDisciplinas))}
                      mb="sm"
                    />

                    {/* Disciplinas já matriculadas */}
                    <Title order={4} mt="md">Disciplinas Matriculadas</Title>
                    <Table striped highlightOnHover mt="md">
                      <thead>
                        <tr>
                          <th>Nome</th>
                          <th>Aberto para Matrícula</th>
                          <th>Número de Créditos</th>
                          <th>Ação</th>
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
                                <Button color="red" onClick={() => handleDesmatricular(disciplina.idDisciplinas)}>
                                  Desmatricular
                                </Button>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" style={{ textAlign: 'center' }}>Nenhuma disciplina matriculada</td>
                          </tr>
                        )}
                      </tbody>
                    </Table>
                  </>
                )}

                {!curso && (
                  <Notification color="yellow" mt="md">
                    O aluno selecionado não está associado a nenhum curso.
                  </Notification>
                )}
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
