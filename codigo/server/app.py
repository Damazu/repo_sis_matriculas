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
    return jsonify({
        'message': "Hello world!",
        'people': ["bruno", "alfredo", "Vinicius"]
    })

if __name__ == "__main__":
    app.run(debug=True, port=8080)