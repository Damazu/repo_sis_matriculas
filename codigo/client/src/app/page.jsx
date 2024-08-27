'use client'
import React, { useEffect, useState } from "react"

function Page() {

  const [message, setMessage] = useState("Loading...")
  const [alunos, setAlunos] = useState([])

  useEffect(() => {
    fetch("http://localhost:8080/api/home")
      .then((response) => response.json())
      .then((data) => {
        // Supondo que o endpoint /api/home retorne os alunos no campo 'alunos'
        setAlunos(data.alunos || [])
        setMessage("Alunos carregados:")
      })
      .catch(() => {
        setMessage("Erro ao carregar os alunos")
      })
  }, []) // O array vazio garante que o useEffect será executado apenas uma vez

  return (
    <>
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
    </>
  )
}

export default Page