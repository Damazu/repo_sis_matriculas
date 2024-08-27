'use client';
import React, { useState, useEffect } from 'react';
import { Table, Container, MantineProvider, Button, Group, Box, Modal, TextInput } from '@mantine/core';
import axios from 'axios';

const SecretárioCadastros = () => {
  // Estado para armazenar os dados dos cursos
  const [data, setData] = useState([]);
  
  // Estado para controlar a página atual
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5; // Número de linhas por página

  // Estado para controlar o modal
  const [modalOpened, setModalOpened] = useState(false);

  // Função para buscar dados da API usando axios
  useEffect(() => {
    axios.get('http://localhost:8080/api/get_cursos')
      .then((response) => {
        console.log(response)
        setData(response.data.cursos);
      })
      .catch((error) => {
        console.error('Erro ao buscar cursos:', error);
      });
  }, []);

  // Cálculo de índices para a paginação
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  // Preencher linhas vazias se houver menos de 5 itens
  const emptyRows = rowsPerPage - currentRows.length;
  const rows = currentRows.map((curso, index) => (
    <tr key={index} style={{ backgroundColor: index % 2 === 0 ? '#f7f9fc' : '#fff' }}>
      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{curso.nomeCurso}</td>
      <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>{curso.numCreditos}</td>
    </tr>
  ));

  // Adicionar as linhas vazias para completar as 5 linhas
  for (let i = 0; i < emptyRows; i++) {
    rows.push(
      <tr key={`empty-${i}`} style={{ backgroundColor: '#fff' }}>
        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>&nbsp;</td>
        <td style={{ padding: '12px', borderBottom: '1px solid #dee2e6' }}>&nbsp;</td>
      </tr>
    );
  }

  // Função para mudar de página
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Total de páginas
  const totalPages = Math.ceil(data.length / rowsPerPage);

  return (
    <MantineProvider>
      <Container style={{ marginTop: '30px', maxWidth: '800px' }}>
        <Box sx={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
          <Table striped highlightOnHover withBorder withColumnBorders>
            <thead style={{ backgroundColor: '#003399', color: '#fff' }}>
              <tr>
                <th style={{ padding: '12px' }}>Nome</th>
                <th style={{ padding: '12px' }}>Créditos</th>
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
      </Container>

      {/* Modal */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Novo Cadastro"
        centered  // Garante que o modal esteja sempre centralizado
      >
        {/* Conteúdo do Modal */}
        <TextInput label="Nome" placeholder="Digite o nome do curso" mb="sm" />
        <TextInput label="Créditos" placeholder="Digite o número de créditos" />
        <Group position="right" mt="md">
          <Button onClick={() => setModalOpened(false)}>Salvar</Button>
        </Group>
      </Modal>
    </MantineProvider>
  );
};

export default SecretárioCadastros;
