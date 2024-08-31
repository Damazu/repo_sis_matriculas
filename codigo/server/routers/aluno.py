from flask import Blueprint, request, jsonify
from data.database import get_db_connection
import psycopg2
from psycopg2.errors import UniqueViolation

# Cria um Blueprint para a rota de Aluno
aluno_bp = Blueprint('aluno', __name__)

@aluno_bp.route('/add_aluno', methods=['POST'])
def add_aluno():
    conn = None
    cursor = None
    try:
        # Recebe os dados do corpo da requisição
        data = request.json

        # Extrai os campos necessários
        nome = data.get('nome')
        matricula = data.get('matricula')
        usuario_id = data.get('Usuario_idUsuario')

        # Verifica se os dados estão presentes
        if not nome or not matricula or not usuario_id:
            return jsonify({'error': 'Todos os campos são obrigatórios: nome, matricula e Usuario_idUsuario'}), 400

        # Conecte ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insere os dados na tabela Aluno
        insert_query = """
            INSERT INTO Aluno (nome, matricula, Usuario_idUsuario)
            VALUES (%s, %s, %s)
        """
        cursor.execute(insert_query, (nome, matricula, usuario_id))

        conn.commit()

        return jsonify({'message': 'Aluno inserido com sucesso!'}), 201

    except UniqueViolation:
        if conn:
            conn.rollback()  # Desfaz transações pendentes
        return jsonify({'error': 'Matrícula já existe.'}), 409

    except Exception as e:
        if conn:
            conn.rollback()  # Desfaz transações pendentes
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Rota para listar todos os alunos
@aluno_bp.route('/get_alunos', methods=['GET'])
def get_alunos():
    conn = None
    cursor = None
    try:
        # Conecte ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Executa a consulta SQL para obter todos os alunos
        cursor.execute("SELECT idAluno, nome, matricula, Usuario_idUsuario FROM Aluno")
        alunos = cursor.fetchall()

        # Formata os dados em uma lista de dicionários
        resultado = []
        for aluno in alunos:
            resultado.append({
                'idAluno': aluno[0],
                'nome': aluno[1],
                'matricula': aluno[2],
                'Usuario_idUsuario': aluno[3]
            })

        return jsonify({'alunos': resultado}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@aluno_bp.route('/get_usuarios_disponiveis', methods=['GET'])
def get_usuarios_disponiveis():
    conn = None
    cursor = None
    try:
        # Conecte ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Consulta para buscar usuários que não estão associados a nenhum aluno
        query = """
        SELECT idUsuario, login 
        FROM Usuario 
        WHERE idUsuario NOT IN (SELECT Usuario_idUsuario FROM Aluno)
        """
        cursor.execute(query)
        usuarios = cursor.fetchall()

        # Formata os dados em uma lista de dicionários
        resultado = []
        for usuario in usuarios:
            resultado.append({
                'idUsuario': usuario[0],
                'login': usuario[1]
            })

        return jsonify({'usuarios': resultado}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()