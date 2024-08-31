import React from 'react';

import CadastroCursos from './cursos/page';
import CadastroDisciplinas from './disciplinas/page';
import SelectCursos from './cursoDisciplina/page';

const CursosPage = () => {
  return (
    <div>
      <CadastroCursos />
      <CadastroDisciplinas />
      <SelectCursos />
    </div>
  );
};

export default CursosPage;
