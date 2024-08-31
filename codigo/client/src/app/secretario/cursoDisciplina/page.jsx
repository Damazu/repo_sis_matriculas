'use client';

import React, { useState, useEffect } from 'react';
import { Container, Select, Group, Box, Title, Button, Modal, Table } from '@mantine/core';
import axios from 'axios';

const SelectCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [modalOpened, setModalOpened] = useState(false);
  const [disciplinas, setDisciplinas] = useState([]);
  const [selectedDisciplina, setSelectedDisciplina] = useState(null);
  const [disciplinasAssociadas, setDisciplinasAssociadas] = useState([]);

  // Função para buscar os cursos da API
  const getCursos = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/get_cursos');
      const cursosData = response.data.cursos.map((curso) => ({
        value: curso.idCurso.toString(),
        label: curso.nomeCurso,
      }));
      setCursos(cursosData);
    } catch (error) {
      console.error('Erro ao buscar cursos:', error);
    }
  };

  // Função para buscar as disciplinas da API
  const getDisciplinas = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/get_disciplinas');
      const disciplinasData = response.data.disciplinas.map((disciplina) => ({
        value: disciplina.idDisciplinas.toString(),
        label: disciplina.nome || 'Sem Nome',
      }));
      setDisciplinas(disciplinasData);
    } catch (error) {
      console.error('Erro ao buscar disciplinas:', error);
    }
  };

  // Função para buscar disciplinas associadas a um curso
  const getDisciplinasAssociadas = async (cursoId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/get_disciplinas_by_curso/${cursoId}`);
      setDisciplinasAssociadas(response.data.disciplinas);
    } catch (error) {
      console.error('Erro ao buscar disciplinas associadas:', error);
    }
  };

  // Função para associar uma disciplina a um curso
  const associateDisciplinaToCurso = async () => {
    try {
      await axios.post('http://localhost:8080/api/add_disciplina_to_curso', {
        curso_idcurso: selectedCurso,
        disciplinas_iddisciplinas: selectedDisciplina,
      });
      setModalOpened(false);
      getDisciplinasAssociadas(selectedCurso); // Atualiza a lista de disciplinas associadas
    } catch (error) {
      console.error('Erro ao associar disciplina ao curso:', error);
    }
  };

  // Carrega os cursos ao montar o componente
  useEffect(() => {
    getCursos();
  }, []);

  // Atualiza disciplinas associadas quando um curso é selecionado
  useEffect(() => {
    if (selectedCurso) {
      getDisciplinasAssociadas(selectedCurso);
    }
  }, [selectedCurso]);

  // Função para abrir o modal e carregar as disciplinas
  const handleOpenModal = () => {
    getDisciplinas();
    setModalOpened(true);
  };

  return (
    <Container style={{ marginTop: '30px', maxWidth: '600px', backgroundColor: '#f0f4f8', padding: '20px', borderRadius: '8px' }}>
      <Box sx={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        
        {/* Título estilizado */}
        <Title align="center" order={2} style={{ color: '#003399', marginBottom: '20px' }}>
          Cadastrar Disciplina a um Curso
        </Title>

        <Group position="center" mt="md" style={{ width: '100%' }}>
          <Select
            label="Selecione um Curso"
            placeholder="Pesquise ou selecione um curso"
            searchable
            nothingFound="Nenhum curso encontrado"
            data={cursos}
            value={selectedCurso}
            onChange={(value) => setSelectedCurso(value)}
            style={{ width: '100%' }}
            dropdownPosition="bottom"
          />
        </Group>

        {/* Tabela com disciplinas associadas */}
        {selectedCurso && disciplinasAssociadas.length > 0 && (
          <Table highlightOnHover mt="lg">
            <thead>
              <tr>
                <th>Nome da Disciplina</th>
                <th>Aberto para Matrícula</th>
                <th>Número de Créditos</th>
              </tr>
            </thead>
            <tbody>
              {disciplinasAssociadas.map((disciplina, index) => (
                <tr key={index}>
                  <td>{disciplina.nome}</td>
                  <td>{disciplina.abertoMatricula ? 'Sim' : 'Não'}</td>
                  <td>{disciplina.numCreditos}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {selectedCurso && disciplinasAssociadas.length === 0 && (
          <p style={{ marginTop: '20px', textAlign: 'center' }}>Nenhuma disciplina associada a este curso.</p>
        )}

        <Group position="center" mt="lg">
          <Button onClick={handleOpenModal} color="green" disabled={!selectedCurso}>
            Selecionar Disciplina
          </Button>
        </Group>
      </Box>

      {/* Modal para associar disciplina a curso */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<h2 style={{ textAlign: 'center', color: '#003399' }}>Associar Disciplina</h2>}
        centered
      >
        <Select
          label="Selecione uma Disciplina"
          placeholder="Pesquise ou selecione uma disciplina"
          searchable
          nothingFound="Nenhuma disciplina encontrada"
          data={disciplinas}
          value={selectedDisciplina}
          onChange={(value) => setSelectedDisciplina(value)}
          style={{ width: '100%', marginTop: '20px' }}
          dropdownPosition="bottom"
        />

        {/* O botão "Associar" só aparece se uma disciplina for selecionada */}
        {selectedDisciplina && (
          <Group position="right" mt="md">
            <Button onClick={associateDisciplinaToCurso} color="blue">
              Associar Disciplina
            </Button>
          </Group>
        )}
      </Modal>
    </Container>
  );
};

export default SelectCursos;
