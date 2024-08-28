import React from 'react';

import CadastroCursos from './cursos/page';
import CadastroDisciplinas from './disciplinas/page';

const CursosPage = () => {
  return (
    <div>
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Cursos</h1>
      <CadastroCursos />
      <h1 style={{ textAlign: 'center', marginTop: '20px' }}>Disciplinas</h1>
      <CadastroDisciplinas />
    </div>
  );
};

export default CursosPage;
