from flask import Flask, request
import os

from printer import imprimir

app = Flask(__name__)
UPLOAD_FOLDER = 'files'

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return {'erro': 'Nenhum arquivo enviado'}, 400

    file = request.files['file']
    file_path = os.path.join(UPLOAD_FOLDER, file.filename)
    file.save(file_path)

    print(f"Arquivo recebido e salvo em: {file_path}")
    try:
        imprimir(file.filename)
        return {'mensagem': 'Arquivo recebido e enviado para impressão com sucesso'}, 200
    except Exception as e:
        return {'erro': f'Falha ao imprimir: {str(e)}'}, 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=1111)
