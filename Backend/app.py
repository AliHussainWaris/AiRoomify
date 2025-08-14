from flask import Flask
from routes.user_routes import user_routes  
from routes.cateogry_routes import category_routes
from routes.product_routes import product_routes
from routes.order_routes import order_routes
from routes.chat_routes import chat_routes
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.secret_key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'  # for sessions or JWT if you add it later
    CORS(app)

    # Register your blueprint(s)
    app.register_blueprint(user_routes)
    app.register_blueprint(category_routes)
    app.register_blueprint(product_routes)
    app.register_blueprint(order_routes)
    app.register_blueprint(chat_routes)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
