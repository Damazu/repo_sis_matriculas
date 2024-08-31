'use client';
import React from "react";
import { MantineProvider } from '@mantine/core';
import Layout from "../components/applayout/layout";
import '@mantine/core/styles.css';

function page() {
  return (
    <MantineProvider>
        <div>
          {/* Conteúdo da sua página */}
          <h1>Bem-vindo ao SisMatricula!</h1>
          {/* Outros componentes ou conteúdo específico da página */}
        </div>
    </MantineProvider>
  );
}
k
/*  <>
      <div>{message}</div>
      <div>
        {alunos.length > 0 ? (
          alunos.map((aluno) => (
            <div key={aluno.idAluno}>
              <p><strong>ID:</strong> {aluno.idAluno}</p>
              <p><strong>Nome:</strong> {aluno.nome}</p>
              <p><strong>Matrícula:</strong> {aluno.matricula}</p>
              <p><strong>ID do Usuário:</strong> {aluno.Usuario_idUsuario}</p>
              <hr />
            </div>
          ))
        ) : (
          <p>Nenhum aluno encontrado</p>
        )}
      </div>
    </>*/
export default Page
