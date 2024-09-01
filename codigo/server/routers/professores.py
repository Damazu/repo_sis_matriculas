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

@professor_bp.route('/get_professores_by_disciplina/<int:idDisciplina>', methods=['GET'])
def get_professores_by_disciplina(idDisciplina):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
            SELECT p.idProfessores, p.nome, p.Usuario_idUsuario
            FROM Professores p
            JOIN Professores_has_Disciplinas pd ON pd.Professores_idProfessores = p.idProfessores
            WHERE pd.Disciplinas_idDisciplinas = %s
        """
        cursor.execute(query, (idDisciplina,))
        professores = cursor.fetchall()

        resultado = [
            {
                'idProfessores': professor[0],
                'nome': professor[1],
                'Usuario_idUsuario': professor[2]
            }
            for professor in professores
        ]

        return jsonify({'professores': resultado}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@professor_bp.route('/add_professor_to_disciplina', methods=['POST'])
def add_professor_to_disciplina():
    conn = None
    cursor = None
    try:
        data = request.json
        professor_id = data.get('Professores_idProfessores')
        disciplina_id = data.get('Disciplinas_idDisciplinas')

        if not professor_id or not disciplina_id:
            return jsonify({'error': 'Todos os campos são obrigatórios: Professores_idProfessores e Disciplinas_idDisciplinas'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        insert_query = """
            INSERT INTO Professores_has_Disciplinas (Professores_idProfessores, Disciplinas_idDisciplinas)
            VALUES (%s, %s)
        """
        cursor.execute(insert_query, (professor_id, disciplina_id))

        conn.commit()

        return jsonify({'message': 'Professor associado à disciplina com sucesso!'}), 201

    except UniqueViolation:
        if conn:
            conn.rollback()
        return jsonify({'error': 'A associação entre o professor e a disciplina já existe.'}), 409

    except ForeignKeyViolation:
        if conn:
            conn.rollback()
        return jsonify({'error': 'Professor ou Disciplina não encontrada.'}), 400

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
