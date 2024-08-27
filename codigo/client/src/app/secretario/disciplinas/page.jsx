'use client';
import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Group, Box, Modal, TextInput, Switch } from '@mantine/core';
import axios from 'axios';

const CadastroDisciplinas = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [modalOpened, setModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [nome, setNome] = useState('');
  const [abertoMatricula, setAbertoMatricula] = useState(false);
  const [numCreditos, setNumCreditos] = useState('');
  const [currentEditDisciplina, setCurrentEditDisciplina] = useState(null);

  const getInfoDisciplinasBD = () => {
    axios.get('http://localhost:8080/api/get_disciplinas')
      .then((response) => {
        setData(response.data.disciplinas || []);
      })
      .catch((error) => {
        console.error('Erro ao buscar disciplinas:', error);
      });
  };

  useEffect(() => {
    getInfoDisciplinasBD();
  }, []);

  const handleAddDisciplina = () => {
    const novaDisciplina = {
      nome,
      abertoMatricula,
      numCreditos: parseInt(numCreditos, 10)
    };

    axios.post('http://localhost:8080/api/add_disciplina', novaDisciplina)
      .then((response) => {
        const disciplinaAdicionada = response.data.disciplina;
        setData((prevData) => [...prevData, disciplinaAdicionada]);
        setNome('');
        setAbertoMatricula(false);
        setNumCreditos('');
        setModalOpened(false);
      })
      .catch((error) => {
        console.error('Erro ao adicionar disciplina:', error);
      });
  };

  const handleEditDisciplina = () => {
    const updatedDisciplina = {
      nome,
      abertoMatricula,
      numCreditos: parseInt(numCreditos, 10)
    };

    axios.put(`http://localhost:8080/api/update_disciplina/${currentEditDisciplina.idDisciplinas}`, updatedDisciplina)
      .then(() => {
        setData((prevData) =>
          prevData.map((disciplina) =>
            disciplina.idDisciplinas === currentEditDisciplina.idDisciplinas ? { ...disciplina, ...updatedDisciplina } : disciplina
          )
        );
        setNome('');
        setAbertoMatricula(false);
        setNumCreditos('');
        setEditModalOpened(false);
      })
      .catch((error) => {
        console.error('Erro ao editar disciplina:', error);
      });
  };

  const handleDeleteDisciplina = (idDisciplinas) => {
    axios.delete(`http://localhost:8080/api/delete_disciplina/${idDisciplinas}`)
      .then(() => {
        setData((prevData) => prevData.filter((disciplina) => disciplina.idDisciplinas !== idDisciplinas));
      })
      .catch((error) => {
        console.error('Erro ao excluir disciplina:', error);
      });
      getInfoDisciplinasBD();
  };

  const openEditModal = (disciplina) => {
    setCurrentEditDisciplina(disciplina);
    setNome(disciplina.nome);
    setAbertoMatricula(disciplina.abertoMatricula);
    setNumCreditos(disciplina.numCreditos);
    setEditModalOpened(true);
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const emptyRows = rowsPerPage - currentRows.length;
  const rows = currentRows.map((disciplina, index) => (
    disciplina && (
      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f7f9fc' : '#fff' }}>
        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{disciplina.nome}</td>
        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{disciplina.abertoMatricula ? 'Sim' : 'Não'}</td>
        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{disciplina.numCreditos}</td>
        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
          <Button onClick={() => openEditModal(disciplina)} color="blue" size="xs" style={{ marginRight: '5px' }}>
            Editar
          </Button>
          <Button onClick={() => handleDeleteDisciplina(disciplina.idDisciplinas)} color="red" size="xs">
            Excluir
          </Button>
        </td>
      </tr>
    )
  ));

  for (let i = 0; i < emptyRows; i++) {
    rows.push(
      <tr key={`empty-${i}`} style={{ backgroundColor: '#fff' }}>
        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>&nbsp;</td>
        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>&nbsp;</td>
        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>&nbsp;</td>
        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>&nbsp;</td>
      </tr>
    );
  }

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <Container style={{ marginTop: '30px', maxWidth: '800px' }}>
      <Box sx={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <Table striped highlightOnHover withBorder withColumnBorders>
          <thead style={{ backgroundColor: '#003399', color: '#fff' }}>
            <tr>
              <th style={{ padding: '12px' }}>Nome</th>
              <th style={{ padding: '12px' }}>Aberto para Matrícula</th>
              <th style={{ padding: '12px' }}>Créditos</th>
              <th style={{ padding: '12px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        <Group position="center" mt="md">
          {Array.from({ length: totalPages }, (_, i) => (
            <Button
              key={i}
              onClick={() => handlePageChange(i + 1)}
              disabled={currentPage === i + 1}
              variant={currentPage === i + 1 ? 'filled' : 'outline'}
              color={currentPage === i + 1 ? 'blue' : 'gray'}
              style={{ margin: '0 5px' }}
            >
              {i + 1}
            </Button>
          ))}
        </Group>
        <Group position="center" mt="lg">
          <Button onClick={() => setModalOpened(true)} color="green">
            Novo
          </Button>
        </Group>
      </Box>

      {/* Modal para adicionar nova disciplina */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Nova Disciplina"
        centered
      >
        <TextInput
          label="Nome"
          placeholder="Digite o nome da disciplina"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          mb="sm"
        />
        <Switch
          label="Aberto para Matrícula"
          checked={abertoMatricula}
          onChange={(e) => setAbertoMatricula(e.currentTarget.checked)}
          mb="sm"
        />
        <TextInput
          label="Créditos"
          placeholder="Digite o número de créditos"
          value={numCreditos}
          onChange={(e) => setNumCreditos(e.target.value)}
        />
        <Group position="right" mt="md">
          <Button onClick={handleAddDisciplina}>Salvar</Button>
        </Group>
      </Modal>

      {/* Modal para editar disciplina */}
      <Modal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        title="Editar Disciplina"
        centered
      >
        <TextInput
          label="Nome"
          placeholder="Digite o nome da disciplina"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          mb="sm"
        />
        <Switch
          label="Aberto para Matrícula"
          checked={abertoMatricula}
          onChange={(e) => setAbertoMatricula(e.currentTarget.checked)}
          mb="sm"
        />
        <TextInput
          label="Créditos"
          placeholder="Digite o número de créditos"
          value={numCreditos}
          onChange={(e) => setNumCreditos(e.target.value)}
        />
        <Group position="right" mt="md">
          <Button onClick={handleEditDisciplina}>Salvar</Button>
        </Group>
      </Modal>
    </Container>
  );
};

export default CadastroDisciplinas;
