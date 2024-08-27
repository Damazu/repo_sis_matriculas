from flask import Blueprint, request, jsonify
from data.database import get_db_connection
import psycopg2
from psycopg2.errors import UniqueViolation, ForeignKeyViolation

# Cria um Blueprint para a rota de Professores
professor_bp = Blueprint('professor', __name__)

@professor_bp.route('/add_professor', methods=['POST'])
def add_professor():
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

        # Insere os dados na tabela Professores
        insert_query = """
            INSERT INTO Professores (nome, Usuario_idUsuario)
            VALUES (%s, %s)
        """
        cursor.execute(insert_query, (nome, usuario_id))

        conn.commit()

        return jsonify({'message': 'Professor inserido com sucesso!'}), 201

    except UniqueViolation:
        if conn:
            conn.rollback()  # Desfaz transações pendentes
        return jsonify({'error': 'Professor já existe.'}), 409

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

# Rota para listar todos os professores
@professor_bp.route('/get_professores', methods=['GET'])
def get_professores():
    conn = None
    cursor = None
    try:
        # Conecte ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Executa a consulta SQL para obter todos os professores
        cursor.execute("SELECT idProfessores, nome, Usuario_idUsuario FROM Professores")
        professores = cursor.fetchall()

        # Formata os dados em uma lista de dicionários
        resultado = []
        for professor in professores:
            resultado.append({
                'idProfessores': professor[0],
                'nome': professor[1],
                'Usuario_idUsuario': professor[2]
            })

        return jsonify({'professores': resultado}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()