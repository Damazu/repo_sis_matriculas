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
        data = request.json
        nome_curso = data.get('nomeCurso')
        num_creditos = data.get('numCreditos')

        if not nome_curso or num_creditos is None:
            return jsonify({'error': 'Todos os campos são obrigatórios: nomeCurso e numCreditos'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        insert_query = """
            INSERT INTO Curso (nomeCurso, numCreditos)
            VALUES (%s, %s)
        """
        cursor.execute(insert_query, (nome_curso, num_creditos))

        conn.commit()

        return jsonify({'message': 'Curso inserido com sucesso!'}), 201

    except UniqueViolation:
        if conn:
            conn.rollback()
        return jsonify({'error': 'Curso já existe.'}), 409

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@curso_bp.route('/get_cursos', methods=['GET'])
def get_cursos():
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT idCurso, nomeCurso, numCreditos FROM Curso")
        cursos = cursor.fetchall()

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

# Rota para deletar um curso por ID
@curso_bp.route('/delete_curso/<int:idCurso>', methods=['DELETE'])
def delete_curso(idCurso):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT idCurso FROM Curso WHERE idCurso = %s", (idCurso,))
        curso = cursor.fetchone()

        if curso is None:
            return jsonify({'error': 'Curso não encontrado.'}), 404

        delete_query = "DELETE FROM Curso WHERE idCurso = %s"
        cursor.execute(delete_query, (idCurso,))
        conn.commit()

        return jsonify({'message': 'Curso deletado com sucesso!'}), 200

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Rota para atualizar um curso por ID
@curso_bp.route('/update_curso/<int:idCurso>', methods=['PUT'])
def update_curso(idCurso):
    conn = None
    cursor = None
    try:
        data = request.json
        nome_curso = data.get('nomeCurso')
        num_creditos = data.get('numCreditos')

        if not nome_curso or num_creditos is None:
            return jsonify({'error': 'Todos os campos são obrigatórios: nomeCurso e numCreditos'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT idCurso FROM Curso WHERE idCurso = %s", (idCurso,))
        curso = cursor.fetchone()

        if curso is None:
            return jsonify({'error': 'Curso não encontrado.'}), 404

        update_query = """
            UPDATE Curso
            SET nomeCurso = %s, numCreditos = %s
            WHERE idCurso = %s
        """
        cursor.execute(update_query, (nome_curso, num_creditos, idCurso))
        conn.commit()

        return jsonify({'message': 'Curso atualizado com sucesso!'}), 200

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@curso_bp.route('/get_disciplinas_by_curso/<int:idCurso>', methods=['GET'])
def get_disciplinas_by_curso(idCurso):
    conn = None
    cursor = None
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        query = """
            SELECT d.idDisciplinas, d.nome, d.abertoMatricula, d.numCreditos
            FROM curso_has_disciplinas chd
            JOIN Disciplinas d ON chd.disciplinas_iddisciplinas = d.idDisciplinas
            WHERE chd.curso_idcurso = %s
        """
        cursor.execute(query, (idCurso,))
        disciplinas = cursor.fetchall()

        resultado = [
            {
                'idDisciplinas': disciplina[0],
                'nome': disciplina[1],
                'abertoMatricula': disciplina[2],
                'numCreditos': disciplina[3]
            }
            for disciplina in disciplinas
        ]

        return jsonify({'disciplinas': resultado}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Rota para associar uma disciplina a um curso
@curso_bp.route('/add_disciplina_to_curso', methods=['POST'])
def add_disciplina_to_curso():
    conn = None
    cursor = None
    try:
        data = request.json
        id_curso = data.get('curso_idcurso')
        id_disciplina = data.get('disciplinas_iddisciplinas')

        if not id_curso or not id_disciplina:
            return jsonify({'error': 'Todos os campos são obrigatórios: curso_idcurso e disciplinas_iddisciplinas'}), 400

        conn = get_db_connection()
        cursor = conn.cursor()

        insert_query = """
            INSERT INTO curso_has_disciplinas (curso_idcurso, disciplinas_iddisciplinas)
            VALUES (%s, %s)
        """
        cursor.execute(insert_query, (id_curso, id_disciplina))

        conn.commit()

        return jsonify({'message': 'Disciplina associada ao curso com sucesso!'}), 201

    except UniqueViolation:
        if conn:
            conn.rollback()
        return jsonify({'error': 'Essa associação entre curso e disciplina já existe.'}), 409

    except Exception as e:
        if conn:
            conn.rollback()
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
