from flask import Blueprint, request, jsonify
from data.database import get_db_connection
import psycopg2
from psycopg2.errors import ForeignKeyViolation

# Cria um Blueprint para a rota de Secretario
secretario_bp = Blueprint('secretario', __name__)

@secretario_bp.route('/add_secretario', methods=['POST'])
def add_secretario():
    conn = None
    cursor = None
    try:
        # Recebe os dados do corpo da requisição
        data = request.json

        # Extrai os campos necessários
        nome = data.get('nome')
        usuario_id = data.get('Usuario_idUsuario')

        # Verifica se os dados estão presentes
        if not nome or not usuario_id:
            return jsonify({'error': 'Todos os campos são obrigatórios: nome e Usuario_idUsuario'}), 400

        # Conecte ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insere os dados na tabela Secretario
        insert_query = """
            INSERT INTO Secretario (nome, Usuario_idUsuario)
            VALUES (%s, %s)
        """
        cursor.execute(insert_query, (nome, usuario_id))

        conn.commit()

        return jsonify({'message': 'Secretário inserido com sucesso!'}), 201

    except ForeignKeyViolation:
        if conn:
            conn.rollback()  # Desfaz transações pendentes
        return jsonify({'error': 'Usuário não encontrado.'}), 400

    except Exception as e:
        if conn:
            conn.rollback()  # Desfaz transações pendentes
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Rota para listar todos os secretários
@secretario_bp.route('/get_secretarios', methods=['GET'])
def get_secretarios():
    conn = None
    cursor = None
    try:
        # Conecte ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Executa a consulta SQL para obter todos os secretários
        cursor.execute("SELECT idSecretario, nome, Usuario_idUsuario FROM Secretario")
        secretarios = cursor.fetchall()

        # Formata os dados em uma lista de dicionários
        resultado = []
        for secretario in secretarios:
            resultado.append({
                'idSecretario': secretario[0],
                'nome': secretario[1],
                'Usuario_idUsuario': secretario[2]
            })

        return jsonify({'secretarios': resultado}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()