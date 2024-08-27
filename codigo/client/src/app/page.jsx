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

export default page;
