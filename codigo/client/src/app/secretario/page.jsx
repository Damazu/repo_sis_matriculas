import React from 'react';
import { Table, Container, MantineProvider } from '@mantine/core';

const SecretárioCadastros = () => {
    // Dados de exemplo para a tabela
    const data = [
      { nome: 'Matemática', creditos: 4 },
      { nome: 'Física', creditos: 3 },
      { nome: 'Química', creditos: 4 },
      { nome: 'Biologia', creditos: 3 },
    ];
  
    // Renderizar as linhas da tabela
    const rows = data.map((curso, index) => (
      <tr key={index}>
        <td>{curso.nome}</td>
        <td>{curso.creditos}</td>
      </tr>
    ));
  
    return (
      <MantineProvider>
      <Container>
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Créditos</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </Container>
      </MantineProvider>
    );
  };
  
  export default SecretárioCadastros;
  