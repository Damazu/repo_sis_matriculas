import React from 'react';

import CadastroCursos from './cursos/page';
import CadastroDisciplinas from './disciplinas/page';
import SelectCursos from './cursoDisciplina/page';
import CadastroProfessores from './disciplinaProfessores/page';

const CursosPage = () => {
  return (
    <div>
      <CadastroCursos />
      <CadastroDisciplinas />
      <SelectCursos />
      <CadastroProfessores />
    </div>
  );
};

export default CursosPage;
