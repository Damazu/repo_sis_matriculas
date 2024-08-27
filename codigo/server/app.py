from flask import Flask, jsonify
from flask_cors import CORS
from routers.aluno import aluno_bp
from routers.usuario import usuario_bp
from routers.professores import professor_bp
from routers.disciplinas import disciplina_bp
from routers.matricula import matricula_bp
from routers.curso import curso_bp
from routers.cobranca import cobranca_bp
from routers.secretario import secretario_bp
from data.database import get_db_connection  # Importa a função de conexão com o banco de dados



app = Flask(__name__)
CORS(app)

# Registro do Blueprint
app.register_blueprint(aluno_bp, url_prefix='/api')
app.register_blueprint(usuario_bp, url_prefix='/api')
app.register_blueprint(professor_bp, url_prefix='/api')
app.register_blueprint(disciplina_bp, url_prefix='/api')
app.register_blueprint(matricula_bp, url_prefix='/api')
app.register_blueprint(curso_bp, url_prefix='/api')
app.register_blueprint(cobranca_bp, url_prefix='/api')
app.register_blueprint(secretario_bp, url_prefix='/api')


@app.route("/api/home", methods=['GET'])
def return_home():
    conn = None
    cursor = None
    try:
        # Conecte ao banco de dados
        conn = get_db_connection()
        cursor = conn.cursor()

        # Executa a consulta SQL para obter todos os alunos
        cursor.execute("SELECT idAluno, nome, matricula, Usuario_idUsuario FROM Aluno")
        alunos = cursor.fetchall()

        # Formata os dados em uma lista de dicionários
        resultado = []
        for aluno in alunos:
            resultado.append({
                'idAluno': aluno[0],
                'nome': aluno[1],
                'matricula': aluno[2],
                'Usuario_idUsuario': aluno[3]
            })

        # Retorna os dados dos alunos no JSON de resposta
        return jsonify({'alunos': resultado}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()
            
if __name__ == "__main__":
    app.run(debug=True, port=8080)