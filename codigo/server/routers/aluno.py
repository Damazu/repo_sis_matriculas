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