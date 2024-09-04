from flask import Blueprint, request, jsonify
from data.database import get_db_connection
import psycopg2
from psycopg2.errors import UniqueViolation

# Cria um Blueprint para a rota de Aluno
aluno_bp = Blueprint('aluno', __name__)

# Função para adicionar um aluno
@aluno_bp.route('/add_aluno', methods=['POST'])
def add_aluno():
    conn = None
    cursor = None
    try:
        data = request.json
        nome = data.get('nome')
        matricula = data.get('matricula')
        usuario_id = data.get('Usuario_idUsuario')

        if not nome or not matricula or not usuario_id:
            return jsonify({'error': 'Todos os campos são obrigatórios: nome, matricula e Usuario_idUsuario'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Adiciona o RETURNING para capturar o ID do aluno recém-inserido
        insert_query = "INSERT INTO Aluno (nome, matricula, Usuario_idUsuario) VALUES (%s, %s, %s) RETURNING idAluno"
        cursor.execute(insert_query, (nome, matricula, usuario_id))
        id_aluno = cursor.fetchone()[0]

        conn.commit()

        return jsonify({'message': 'Aluno inserido com sucesso!', 'idAluno': id_aluno}), 201

    except UniqueViolation:
        if conn:
            conn.rollback()
        return jsonify({'error': 'Matrícula já existe.'}), 409

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
# Função para listar todos os alunos
@aluno_bp.route('/get_alunos', methods=['GET'])
def get_alunos():
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT idAluno, nome, matricula, Usuario_idUsuario FROM Aluno")
        alunos = cursor.fetchall()

        resultado = [{'idAluno': aluno[0], 'nome': aluno[1], 'matricula': aluno[2], 'Usuario_idUsuario': aluno[3]} for aluno in alunos]
        return jsonify({'alunos': resultado}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Função para buscar usuários disponíveis
@aluno_bp.route('/get_usuarios_disponiveis', methods=['GET'])
def get_usuarios_disponiveis():
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = "SELECT idUsuario, login FROM Usuario WHERE idUsuario NOT IN (SELECT Usuario_idUsuario FROM Aluno)"
        cursor.execute(query)
        usuarios = cursor.fetchall()

        resultado = [{'idUsuario': usuario[0], 'login': usuario[1]} for usuario in usuarios]
        return jsonify({'usuarios': resultado}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Função para buscar um aluno específico
@aluno_bp.route('/get_aluno/<int:idAluno>', methods=['GET'])
def get_aluno(idAluno):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT idAluno, nome, matricula, Usuario_idUsuario FROM Aluno WHERE idAluno = %s", (idAluno,))
        aluno = cursor.fetchone()

        if aluno:
            resultado = {'idAluno': aluno[0], 'nome': aluno[1], 'matricula': aluno[2], 'Usuario_idUsuario': aluno[3]}
            return jsonify({'aluno': resultado}), 200
        else:
            return jsonify({'error': 'Aluno não encontrado'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Função para deletar um aluno
@aluno_bp.route('/delete_aluno/<int:idAluno>', methods=['DELETE'])
def delete_aluno(idAluno):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("DELETE FROM Aluno WHERE idAluno = %s", (idAluno,))
        conn.commit()

        return jsonify({'message': 'Aluno deletado com sucesso'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Função para matricular aluno em disciplinas
@aluno_bp.route('/matricular_aluno', methods=['POST'])
def matricular_aluno():
    conn = None
    cursor = None
    try:
        data = request.json
        id_aluno = data.get('idAluno')
        disciplinas = data.get('disciplinas')

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT Curso_idCurso FROM Curso_has_Aluno WHERE Aluno_idAluno = %s", (id_aluno,))
        curso_id = cursor.fetchone()[0]

        insert_query = "INSERT INTO Aluno_has_Disciplinas (Aluno_idAluno, Disciplinas_idDisciplinas) VALUES (%s, %s)"
        for disciplina_id in disciplinas:
            cursor.execute("SELECT COUNT(*) FROM Curso_has_Disciplinas WHERE Curso_idCurso = %s AND Disciplinas_idDisciplinas = %s", (curso_id, disciplina_id))
            count = cursor.fetchone()[0]

            if count == 0:
                return jsonify({'error': f'A disciplina {disciplina_id} não está disponível para o curso selecionado.'}), 400

            cursor.execute(insert_query, (id_aluno, disciplina_id))

        conn.commit()

        return jsonify({'message': 'Aluno matriculado com sucesso!'}), 201

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Função para obter disciplinas de um aluno
@aluno_bp.route('/get_disciplinas_aluno/<int:idAluno>', methods=['GET'])
def get_disciplinas_aluno(idAluno):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        query = """
            SELECT d.idDisciplinas, d.nome, d.abertoMatricula, d.numCreditos
            FROM Disciplinas d
            JOIN Aluno_has_Disciplinas ahd ON d.idDisciplinas = ahd.Disciplinas_idDisciplinas
            WHERE ahd.Aluno_idAluno = %s
        """
        cursor.execute(query, (idAluno,))
        disciplinas = cursor.fetchall()

        resultado = [{'idDisciplinas': disciplina[0], 'nome': disciplina[1], 'abertoMatricula': disciplina[2], 'numCreditos': disciplina[3]} for disciplina in disciplinas]
        return jsonify({'disciplinas': resultado}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Função para alocar aluno a um curso
@aluno_bp.route('/alocar_aluno_curso', methods=['POST'])
def alocar_aluno_curso():
    conn = None
    cursor = None
    try:
        data = request.json
        aluno_id = data.get('Aluno_idAluno')
        curso_id = data.get('Curso_idCurso')

        conn = get_db_connection()
        cursor = conn.cursor()
        insert_query = "INSERT INTO Curso_has_Aluno (Curso_idCurso, Aluno_idAluno) VALUES (%s, %s)"
        cursor.execute(insert_query, (curso_id, aluno_id))

        conn.commit()

        return jsonify({'message': 'Aluno alocado ao curso com sucesso!'}), 201

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@aluno_bp.route('/get_curso_aluno/<int:idAluno>', methods=['GET'])
def get_curso_aluno(idAluno):
    conn = None
    cursor = None
    print(idAluno)
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT Curso_idCurso FROM Curso_has_Aluno WHERE Aluno_idAluno = %s", (idAluno,))
        curso_id = cursor.fetchone()

        if not curso_id:
            return jsonify({'error': 'Curso não encontrado para o aluno.'}), 404

        cursor.execute("SELECT idCurso, nomeCurso FROM Curso WHERE idCurso = %s", (curso_id,))
        curso = cursor.fetchone()

        if not curso:
            return jsonify({'error': 'Curso não encontrado.'}), 404

        return jsonify({'curso': {'idCurso': curso[0], 'nomeCurso': curso[1]}}), 200

    except Exception as e:
        print(f"Erro ao buscar curso para o aluno {idAluno}: {e}")
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@aluno_bp.route('/delete_disciplina_aluno', methods=['DELETE'])
def delete_disciplina_aluno():
    conn = None
    cursor = None
    try:
        data = request.json
        id_aluno = data.get('idAluno')
        id_disciplina = data.get('idDisciplinas')

        if not id_aluno or not id_disciplina:
            return jsonify({'error': 'Parâmetros idAluno e idDisciplinas são obrigatórios.'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        # Remover a disciplina do aluno
        delete_query = """
            DELETE FROM Aluno_has_Disciplinas
            WHERE Aluno_idAluno = %s AND Disciplinas_idDisciplinas = %s
        """
        cursor.execute(delete_query, (id_aluno, id_disciplina))
        conn.commit()

        return jsonify({'message': 'Disciplina desmatriculada com sucesso!'}), 200

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()