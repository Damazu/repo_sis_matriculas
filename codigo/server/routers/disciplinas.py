from flask import Blueprint, request, jsonify
from data.database import get_db_connection
import psycopg2
from psycopg2.errors import UniqueViolation

# Cria um Blueprint para a rota de Disciplinas
disciplina_bp = Blueprint('disciplina', __name__)

# Função para adicionar uma disciplina
@disciplina_bp.route('/add_disciplina', methods=['POST'])
def add_disciplina():
    conn = None
    cursor = None
    try:
        data = request.json
        nome = data.get('nome')
        aberto_matricula = data.get('abertoMatricula')
        num_creditos = data.get('numCreditos')

        if nome is None or aberto_matricula is None or num_creditos is None:
            return jsonify({'error': 'Todos os campos são obrigatórios: nome, abertoMatricula e numCreditos'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        insert_query = "INSERT INTO Disciplinas (nome, abertoMatricula, numCreditos) VALUES (%s, %s, %s)"
        cursor.execute(insert_query, (nome, aberto_matricula, num_creditos))
        conn.commit()

        return jsonify({'message': 'Disciplina inserida com sucesso!'}), 201

    except UniqueViolation:
        if conn:
            conn.rollback()
        return jsonify({'error': 'Disciplina já existe.'}), 409

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Função para listar todas as disciplinas
@disciplina_bp.route('/get_disciplinas', methods=['GET'])
def get_disciplinas():
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT idDisciplinas, nome, abertoMatricula, numCreditos FROM Disciplinas")
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

# Função para deletar uma disciplina
@disciplina_bp.route('/delete_disciplina/<int:idDisciplinas>', methods=['DELETE'])
def delete_disciplina(idDisciplinas):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT idDisciplinas FROM Disciplinas WHERE idDisciplinas = %s", (idDisciplinas,))
        disciplina = cursor.fetchone()

        if disciplina is None:
            return jsonify({'error': 'Disciplina não encontrada.'}), 404

        delete_query = "DELETE FROM Disciplinas WHERE idDisciplinas = %s"
        cursor.execute(delete_query, (idDisciplinas,))
        conn.commit()

        return jsonify({'message': 'Disciplina deletada com sucesso!'}), 200

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Função para atualizar uma disciplina
@disciplina_bp.route('/update_disciplina/<int:idDisciplinas>', methods=['PUT'])
def update_disciplina(idDisciplinas):
    conn = None
    cursor = None
    try:
        data = request.json
        nome = data.get('nome')
        aberto_matricula = data.get('abertoMatricula')
        num_creditos = data.get('numCreditos')

        if nome is None or aberto_matricula is None or num_creditos is None:
            return jsonify({'error': 'Todos os campos são obrigatórios: nome, abertoMatricula e numCreditos'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT idDisciplinas FROM Disciplinas WHERE idDisciplinas = %s", (idDisciplinas,))
        disciplina = cursor.fetchone()

        if disciplina is None:
            return jsonify({'error': 'Disciplina não encontrada.'}), 404

        update_query = "UPDATE Disciplinas SET nome = %s, abertoMatricula = %s, numCreditos = %s WHERE idDisciplinas = %s"
        cursor.execute(update_query, (nome, aberto_matricula, num_creditos, idDisciplinas))
        conn.commit()

        return jsonify({'message': 'Disciplina atualizada com sucesso!'}), 200

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

<<<<<<< HEAD
            
=======
>>>>>>> merge-interface-back
