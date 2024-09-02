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

# Rota para listar todas as disciplinas
@disciplina_bp.route('/get_disciplinas', methods=['GET'])
def get_disciplinas():
    conn = None
    cursor = None
    try:
        # Conecte ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Executa a consulta SQL para obter todas as disciplinas
        cursor.execute("SELECT idDisciplinas, nome, abertoMatricula, numCreditos FROM Disciplinas")
        disciplinas = cursor.fetchall()

        # Formata os dados em uma lista de dicionários
        resultado = []
        for disciplina in disciplinas:
            resultado.append({
                'idDisciplinas': disciplina[0],
                'nome': disciplina[1],
                'abertoMatricula': disciplina[2],
                'numCreditos': disciplina[3]
            })

        return jsonify({'disciplinas': resultado}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Rota para deletar uma disciplina por ID
@disciplina_bp.route('/delete_disciplina/<int:idDisciplinas>', methods=['DELETE'])
def delete_disciplina(idDisciplinas):
    conn = None
    cursor = None
    try:
        # Conecte ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Verifica se a disciplina existe
        cursor.execute("SELECT idDisciplinas FROM Disciplinas WHERE idDisciplinas = %s", (idDisciplinas,))
        disciplina = cursor.fetchone()

        if disciplina is None:
            return jsonify({'error': 'Disciplina não encontrada.'}), 404

        # Deleta a disciplina
        delete_query = "DELETE FROM Disciplinas WHERE idDisciplinas = %s"
        cursor.execute(delete_query, (idDisciplinas,))
        conn.commit()

        return jsonify({'message': 'Disciplina deletada com sucesso!'}), 200

    except Exception as e:
        if conn:
            conn.rollback()  # Desfaz transações pendentes
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Rota para atualizar uma disciplina por ID
@disciplina_bp.route('/update_disciplina/<int:idDisciplinas>', methods=['PUT'])
def update_disciplina(idDisciplinas):
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

        # Verifica se a disciplina existe
        cursor.execute("SELECT idDisciplinas FROM Disciplinas WHERE idDisciplinas = %s", (idDisciplinas,))
        disciplina = cursor.fetchone()

        if disciplina is None:
            return jsonify({'error': 'Disciplina não encontrada.'}), 404

        # Atualiza a disciplina
        update_query = """
            UPDATE Disciplinas
            SET nome = %s, abertoMatricula = %s, numCreditos = %s
            WHERE idDisciplinas = %s
        """
        cursor.execute(update_query, (nome, aberto_matricula, num_creditos, idDisciplinas))
        conn.commit()

        return jsonify({'message': 'Disciplina atualizada com sucesso!'}), 200

    except Exception as e:
        if conn:
            conn.rollback()  # Desfaz transações pendentes
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

<<<<<<< HEAD
            
=======
>>>>>>> merge-interface-back
