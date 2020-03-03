from flask import Flask
from .routes.main import main
def create_app():
    app = Flask(__name__)
    app.register_blueprint(main)
    # app.run(debug=True)

    return app

