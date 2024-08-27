'use client';
import React, { useState, useEffect } from 'react';
import { Table, Container, Button, Group, Box, Modal, TextInput } from '@mantine/core';
import axios from 'axios';

const SecretárioCadastros = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const [modalOpened, setModalOpened] = useState(false);
  const [editModalOpened, setEditModalOpened] = useState(false);
  const [nomeCurso, setNomeCurso] = useState('');
  const [numCreditos, setNumCreditos] = useState('');
  const [currentEditCurso, setCurrentEditCurso] = useState(null);

  const getInfoCursosBD = () => {
    axios.get('http://localhost:8080/api/get_cursos')
      .then((response) => {
        setData(response.data.cursos || []);
      })
      .catch((error) => {
        console.error('Erro ao buscar cursos:', error);
      });
  };

  useEffect(() => {
    getInfoCursosBD();
  }, []);

  const handleAddCurso = () => {
    const novoCurso = {
      nomeCurso,
      numCreditos: parseInt(numCreditos, 10)
    };

    axios.post('http://localhost:8080/api/add_curso', novoCurso)
      .then((response) => {
        const cursoAdicionado = response.data.curso;
        setData((prevData) => [...prevData, cursoAdicionado]);
        setNomeCurso('');
        setNumCreditos('');
        setModalOpened(false);
      })
      .catch((error) => {
        console.error('Erro ao adicionar curso:', error);
      });
  };

  const handleEditCurso = () => {
    const updatedCurso = {
      nomeCurso,
      numCreditos: parseInt(numCreditos, 10)
    };

    axios.put(`http://localhost:8080/api/update_curso/${currentEditCurso.idCurso}`, updatedCurso)
      .then(() => {
        setData((prevData) =>
          prevData.map((curso) =>
            curso.idCurso === currentEditCurso.idCurso ? { ...curso, ...updatedCurso } : curso
          )
        );
        setNomeCurso('');
        setNumCreditos('');
        setEditModalOpened(false);
      })
      .catch((error) => {
        console.error('Erro ao editar curso:', error);
      });
  };

  const handleDeleteCurso = (idCurso) => {
    axios.delete(`http://localhost:8080/api/delete_curso/${idCurso}`)
      .then(() => {
        setData((prevData) => prevData.filter((curso) => curso.idCurso !== idCurso));
      })
      .catch((error) => {
        console.error('Erro ao excluir curso:', error);
      });
      getInfoCursosBD();
  };

  const openEditModal = (curso) => {
    setCurrentEditCurso(curso);
    setNomeCurso(curso.nomeCurso);
    setNumCreditos(curso.numCreditos);
    setEditModalOpened(true);
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const emptyRows = rowsPerPage - currentRows.length;
  const rows = currentRows.map((curso, index) => (
    curso && (
      <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f7f9fc' : '#fff' }}>
        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{curso.nomeCurso}</td>
        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{curso.numCreditos}</td>
        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>
          <Button onClick={() => openEditModal(curso)} color="blue" size="xs" style={{ marginRight: '5px' }}>
            Editar
          </Button>
          <Button onClick={() => handleDeleteCurso(curso.idCurso)} color="red" size="xs">
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

      {/* Modal para adicionar novo curso */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Novo Cadastro"
        centered
      >
        <TextInput
          label="Nome"
          placeholder="Digite o nome do curso"
          value={nomeCurso}
          onChange={(e) => setNomeCurso(e.target.value)}
          mb="sm"
        />
        <TextInput
          label="Créditos"
          placeholder="Digite o número de créditos"
          value={numCreditos}
          onChange={(e) => setNumCreditos(e.target.value)}
        />
        <Group position="right" mt="md">
          <Button onClick={handleAddCurso}>Salvar</Button>
        </Group>
      </Modal>

      {/* Modal para editar curso */}
      <Modal
        opened={editModalOpened}
        onClose={() => setEditModalOpened(false)}
        title="Editar Cadastro"
        centered
      >
        <TextInput
          label="Nome"
          placeholder="Digite o nome do curso"
          value={nomeCurso}
          onChange={(e) => setNomeCurso(e.target.value)}
          mb="sm"
        />
        <TextInput
          label="Créditos"
          placeholder="Digite o número de créditos"
          value={numCreditos}
          onChange={(e) => setNumCreditos(e.target.value)}
        />
        <Group position="right" mt="md">
          <Button onClick={handleEditCurso}>Salvar</Button>
        </Group>
      </Modal>
    </Container>
  );
};

export default SecretárioCadastros;
