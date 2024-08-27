from flask import Blueprint, request, jsonify
from data.database import get_db_connection
import psycopg2
from psycopg2.errors import UniqueViolation

# Cria um Blueprint para a rota de Curso
curso_bp = Blueprint('curso', __name__)

@curso_bp.route('/add_curso', methods=['POST'])
def add_curso():
    conn = None
    cursor = None
    try:
        # Recebe os dados do corpo da requisição
        data = request.json

        # Extrai os campos necessários
        nome_curso = data.get('nomeCurso')
        num_creditos = data.get('numCreditos')

        # Verifica se os dados estão presentes
        if not nome_curso or num_creditos is None:
            return jsonify({'error': 'Todos os campos são obrigatórios: nomeCurso e numCreditos'}), 400

        # Conecte ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insere os dados na tabela Curso
        insert_query = """
            INSERT INTO Curso (nomeCurso, numCreditos)
            VALUES (%s, %s)
        """
        cursor.execute(insert_query, (nome_curso, num_creditos))

        conn.commit()

        return jsonify({'message': 'Curso inserido com sucesso!'}), 201

    except UniqueViolation:
        if conn:
            conn.rollback()  # Desfaz transações pendentes
        return jsonify({'error': 'Curso já existe.'}), 409

    except Exception as e:
        if conn:
            conn.rollback()  # Desfaz transações pendentes
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Rota para listar todos os cursos
@curso_bp.route('/get_cursos', methods=['GET'])
def get_cursos():
    conn = None
    cursor = None
    try:
        # Conecte ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Executa a consulta SQL para obter todos os cursos
        cursor.execute("SELECT idCurso, nomeCurso, numCreditos FROM Curso")
        cursos = cursor.fetchall()

        # Formata os dados em uma lista de dicionários
        resultado = []
        for curso in cursos:
            resultado.append({
                'idCurso': curso[0],
                'nomeCurso': curso[1],
                'numCreditos': curso[2]
            })

        return jsonify({'cursos': resultado}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()