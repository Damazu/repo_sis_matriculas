'use client';

import React, { useState, useEffect } from 'react';
import { Container, Select, Group, Box, Title, Button, Table, Modal } from '@mantine/core';
import axios from 'axios';

const CadastroProfessores = () => {
  const [disciplinas, setDisciplinas] = useState([]);
  const [selectedDisciplina, setSelectedDisciplina] = useState(null);
  const [professores, setProfessores] = useState([]);
  const [modalOpened, setModalOpened] = useState(false);
  const [allProfessores, setAllProfessores] = useState([]);
  const [selectedProfessor, setSelectedProfessor] = useState(null);

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

  // Função para buscar professores associados a uma disciplina
  const getProfessoresByDisciplina = async (disciplinaId) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/get_professores_by_disciplina/${disciplinaId}`);
      setProfessores(response.data.professores);
    } catch (error) {
      console.error('Erro ao buscar professores:', error);
    }
  };

  // Função para buscar todos os professores da API
  const getAllProfessores = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/get_professores');
      const professoresData = response.data.professores.map((professor) => ({
        value: professor.idProfessores.toString(),
        label: professor.nome || 'Sem Nome',
      }));
      setAllProfessores(professoresData);
    } catch (error) {
      console.error('Erro ao buscar todos os professores:', error);
    }
  };

  // Função para associar um professor a uma disciplina
  const associateProfessorToDisciplina = async () => {
    try {
      await axios.post('http://localhost:8080/api/add_professor_to_disciplina', {
        Professores_idProfessores: selectedProfessor,
        Disciplinas_idDisciplinas: selectedDisciplina,
      });
      setModalOpened(false);
      getProfessoresByDisciplina(selectedDisciplina); // Atualiza a lista de professores associados
    } catch (error) {
      console.error('Erro ao associar professor à disciplina:', error);
    }
  };

  // Carrega as disciplinas ao montar o componente
  useEffect(() => {
    getDisciplinas();
  }, []);

  // Atualiza professores associados quando uma disciplina é selecionada
  useEffect(() => {
    if (selectedDisciplina) {
      getProfessoresByDisciplina(selectedDisciplina);
    }
  }, [selectedDisciplina]);

  // Função para abrir o modal e carregar todos os professores
  const handleOpenModal = () => {
    getAllProfessores();
    setModalOpened(true);
  };

  return (
    <Container style={{ marginTop: '30px', maxWidth: '600px', backgroundColor: '#f0f4f8', padding: '20px', borderRadius: '8px' }}>
      <Box sx={{ padding: '20px', backgroundColor: '#ffffff', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        
        {/* Título estilizado */}
        <Title align="center" order={2} style={{ color: '#003399', marginBottom: '20px' }}>
          Cadastro de Professores
        </Title>

        {/* Select de Disciplinas */}
        <Group position="center" mt="md" style={{ width: '100%' }}>
          <Select
            label="Selecione uma Disciplina"
            placeholder="Pesquise ou selecione uma disciplina"
            searchable
            nothingFound="Nenhuma disciplina encontrada"
            data={disciplinas}
            value={selectedDisciplina}
            onChange={(value) => setSelectedDisciplina(value)}
            style={{ width: '100%' }}
            dropdownPosition="bottom"
          />
        </Group>

        {/* Tabela com professores associados */}
        {selectedDisciplina && professores.length > 0 && (
          <Table highlightOnHover mt="lg">
            <thead>
              <tr>
                <th>Nome do Professor</th>
                <th>ID de Usuário</th>
              </tr>
            </thead>
            <tbody>
              {professores.map((professor, index) => (
                <tr key={index}>
                  <td>{professor.nome}</td>
                  <td>{professor.Usuario_idUsuario}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}

        {selectedDisciplina && professores.length === 0 && (
          <p style={{ marginTop: '20px', textAlign: 'center' }}>Nenhum professor associado a esta disciplina.</p>
        )}

        <Group position="center" mt="lg">
          <Button onClick={handleOpenModal} color="green" disabled={!selectedDisciplina}>
            Cadastrar Professores
          </Button>
        </Group>
      </Box>

      {/* Modal para associar professor à disciplina */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={<h2 style={{ textAlign: 'center', color: '#003399' }}>Associar Professor</h2>}
        centered
      >
        <Select
          label="Selecione um Professor"
          placeholder="Pesquise ou selecione um professor"
          searchable
          nothingFound="Nenhum professor encontrado"
          data={allProfessores}
          value={selectedProfessor}
          onChange={(value) => setSelectedProfessor(value)}
          style={{ width: '100%', marginTop: '20px' }}
          dropdownPosition="bottom"
        />

        <Group position="right" mt="md">
          <Button onClick={associateProfessorToDisciplina} color="blue" disabled={!selectedProfessor}>
            Cadastrar
          </Button>
        </Group>
      </Modal>
    </Container>
  );
};

export default CadastroProfessores;
