from flask import Blueprint, request, jsonify
from data.database import get_db_connection
import psycopg2
from psycopg2.errors import ForeignKeyViolation

# Cria um Blueprint para a rota de Cobranca
cobranca_bp = Blueprint('cobranca', __name__)

@cobranca_bp.route('/add_cobranca', methods=['POST'])
def add_cobranca():
    conn = None
    cursor = None
    try:
        # Recebe os dados do corpo da requisição
        data = request.json

        # Extrai os campos necessários
        tempo_divida = data.get('tempoDivida')
        valor_cobranca = data.get('valorCobranca')
        juros = data.get('juros')
        pago = data.get('pago')
        matricula_id = data.get('Matricula_idMatricula')

        # Verifica se os dados estão presentes
        if tempo_divida is None or valor_cobranca is None or juros is None or pago is None or matricula_id is None:
            return jsonify({'error': 'Todos os campos são obrigatórios: tempoDivida, valorCobranca, juros, pago, Matricula_idMatricula'}), 400

        # Conecte ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Insere os dados na tabela Cobranca
        insert_query = """
            INSERT INTO Cobranca (tempoDivida, valorCobranca, juros, pago, Matricula_idMatricula)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (tempo_divida, valor_cobranca, juros, pago, matricula_id))

        conn.commit()

        return jsonify({'message': 'Cobrança inserida com sucesso!'}), 201

    except ForeignKeyViolation:
        if conn:
            conn.rollback()  # Desfaz transações pendentes
        return jsonify({'error': 'Matrícula não encontrada.'}), 400

    except Exception as e:
        if conn:
            conn.rollback()  # Desfaz transações pendentes
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

# Rota para listar todas as cobranças
@cobranca_bp.route('/get_cobrancas', methods=['GET'])
def get_cobrancas():
    conn = None
    cursor = None
    try:
        # Conecte ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Executa a consulta SQL para obter todas as cobranças
        cursor.execute("SELECT idCobranca, tempoDivida, valorCobranca, juros, pago, Matricula_idMatricula FROM Cobranca")
        cobrancas = cursor.fetchall()

        # Formata os dados em uma lista de dicionários
        resultado = []
        for cobranca in cobrancas:
            resultado.append({
                'idCobranca': cobranca[0],
                'tempoDivida': cobranca[1],
                'valorCobranca': cobranca[2],
                'juros': cobranca[3],
                'pago': cobranca[4],
                'Matricula_idMatricula': cobranca[5]
            })

        return jsonify({'cobrancas': resultado}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()