from flask import Flask, request, jsonify
from db import get_db_connection

app = Flask(__name__)

@app.route('/add_aluno', methods=['POST'])
def add_aluno():
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
        cursor.close()
        conn.close()

        return jsonify({'message': 'Aluno inserido com sucesso!'}), 201

    except psycopg2.IntegrityError as e:
        return jsonify({'error': 'Matrícula já existe.'}), 409

    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)