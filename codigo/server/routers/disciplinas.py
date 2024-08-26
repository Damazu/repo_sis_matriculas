from flask import Blueprint, request, jsonify
from data.database import get_db_connection
import psycopg2
from psycopg2.errors import UniqueViolation

# Cria um Blueprint para a rota de Disciplinas
disciplina_bp = Blueprint('disciplina', __name__)

@disciplina_bp.route('/add_disciplina', methods=['POST'])
def add_disciplina():
    conn = None
    cursor = None
    try:
        # Recebe os dados do corpo da requisição
        data = request.json

        # Extrai os campos necessários
        nome = data.get('nome')
        aberto_matricula = data.get('abertoMatricula')
        num_creditos = data.get('numCreditos')

        # Verifica se os dados estão presentes
        if nome is None or aberto_matricula is None or num_creditos is None:
            return jsonify({'error': 'Todos os campos são obrigatórios: nome, abertoMatricula e numCreditos'}), 400

        # Conecte ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insere os dados na tabela Disciplinas
        insert_query = """
            INSERT INTO Disciplinas (nome, abertoMatricula, numCreditos)
            VALUES (%s, %s, %s)
        """
        cursor.execute(insert_query, (nome, aberto_matricula, num_creditos))

        conn.commit()

        return jsonify({'message': 'Disciplina inserida com sucesso!'}), 201

    except UniqueViolation:
        if conn:
            conn.rollback()  # Desfaz transações pendentes
        return jsonify({'error': 'Disciplina já existe.'}), 409

    except Exception as e:
        if conn:
            conn.rollback()  # Desfaz transações pendentes
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
