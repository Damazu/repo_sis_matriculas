'use client';
import React, { useState, useEffect } from 'react';
import { Container, Loader, Table, Box, Notification, Title, Select, Button, Group } from '@mantine/core';
import axios from 'axios';

const PerfilAluno = () => {
  const [alunos, setAlunos] = useState([]);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState({ message: '', color: '' });

  useEffect(() => {
    // Busca os dados dos alunos
    axios.get('http://localhost:8080/api/get_alunos')
      .then((response) => {
        console.log(response.data.alunos); // Adicione este log para verificar os dados retornados
        setAlunos(response.data.alunos);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar alunos:', error);
        setNotification({ message: 'Erro ao carregar dados dos alunos.', color: 'red' });
        setLoading(false);
      });
  }, []);
  

  const handleSelectChange = (idAluno) => {
    const aluno = alunos.find(a => a.idAluno === parseInt(idAluno, 10));
    setAlunoSelecionado(aluno);
  };

  const handleDesmatricular = () => {
    if (!alunoSelecionado) return;

    axios.delete(`http://localhost:8080/api/delete_aluno/${alunoSelecionado.idAluno}`)
      .then(() => {
        setNotification({ message: 'Aluno desmatriculado com sucesso!', color: 'green' });
        setAlunos(alunos.filter(aluno => aluno.idAluno !== alunoSelecionado.idAluno));
        setAlunoSelecionado(null);
      })
      .catch((error) => {
        console.error('Erro ao desmatricular o aluno:', error);
        setNotification({ message: 'Erro ao desmatricular o aluno. Tente novamente.', color: 'red' });
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
            )}

            <Group position="center" mt="md">
              <Button
                color="red"
                onClick={handleDesmatricular}
                disabled={!alunoSelecionado}
              >
                Desmatricular Aluno
              </Button>
            </Group>
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