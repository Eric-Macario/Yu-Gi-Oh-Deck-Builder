from flask import Flask
from flask_restful import Api
from flask_migrate import Migrate
from models import db 
from models import User, Card, Collection, Deck, Wishlist

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

api = Api(app)
migrate = Migrate(app, db)

from models import User, Card, Collection, Deck, Wishlist

db.init_app(app)

@app.route('/')
def hello():
    return 'Hello Flask!'

if __name__ == '__main__':
    app.run()
