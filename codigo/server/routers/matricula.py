from flask import Blueprint, request, jsonify
from data.database import get_db_connection
import psycopg2
from psycopg2.errors import ForeignKeyViolation

# Cria um Blueprint para a rota de Matricula
matricula_bp = Blueprint('matricula', __name__)

@matricula_bp.route('/add_matricula', methods=['POST'])
def add_matricula():
    conn = None
    cursor = None
    try:
        # Recebe os dados do corpo da requisição
        data = request.json

        # Extrai os campos necessários
        data_matricula = data.get('data')
        status = data.get('status')
        disciplinas_id = data.get('Disciplinas_idDisciplinas')
        aluno_id = data.get('Aluno_idAluno')

        # Verifica se os dados estão presentes
        if not data_matricula or status is None or not disciplinas_id or not aluno_id:
            return jsonify({'error': 'Todos os campos são obrigatórios: data, status, Disciplinas_idDisciplinas e Aluno_idAluno'}), 400

        # Conecte ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insere os dados na tabela Matricula
        insert_query = """
            INSERT INTO Matricula (data, status, Disciplinas_idDisciplinas, Aluno_idAluno)
            VALUES (%s, %s, %s, %s)
        """
        cursor.execute(insert_query, (data_matricula, status, disciplinas_id, aluno_id))

        conn.commit()

        return jsonify({'message': 'Matrícula inserida com sucesso!'}), 201

    except ForeignKeyViolation:
        if conn:
            conn.rollback()  # Desfaz transações pendentes
        return jsonify({'error': 'Disciplina ou Aluno não encontrado.'}), 400

    except Exception as e:
        if conn:
            conn.rollback()  # Desfaz transações pendentes
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
# Rota para listar todas as matrículas
@matricula_bp.route('/get_matriculas', methods=['GET'])
def get_matriculas():
    conn = None
    cursor = None
    try:
        # Conecte ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Executa a consulta SQL para obter todas as matrículas
        cursor.execute("SELECT idMatricula, data, status, Disciplinas_idDisciplinas, Aluno_idAluno FROM Matricula")
        matriculas = cursor.fetchall()

        # Formata os dados em uma lista de dicionários
        resultado = []
        for matricula in matriculas:
            resultado.append({
                'idMatricula': matricula[0],
                'data': matricula[1],
                'status': matricula[2],
                'Disciplinas_idDisciplinas': matricula[3],
                'Aluno_idAluno': matricula[4]
            })

        return jsonify({'matriculas': resultado}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()