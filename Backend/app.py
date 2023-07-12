from flask import Flask, jsonify, make_response, request, session, abort
from werkzeug.security import check_password_hash, generate_password_hash
from flask_restful import Api,  Resource
from flask_migrate import Migrate
from flask_cors import CORS
from sqlalchemy.orm.exc import FlushError
from pandas import *
from models import db 
from models import User, Card, Collection, Deck, Wishlist, deck_cards
from code import coolkey
import os

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

api = Api(app)
migrate = Migrate(app, db)
app.secret_key = coolkey


db.init_app(app)
CORS(app)

@app.route('/')
def hello():
    return 'Hello Flask!'


class Signup(Resource):
    def post(self):
        data = request.get_json()
        name = data.get('name')
        username = data.get('username')
        password = data.get('password')

        if not name or not username or not password:
            return make_response(jsonify(message='Missing required fields'), 400)

        if User.query.filter_by(username=username).first():
            return make_response(jsonify(message='Username is already taken'), 409)

        new_user = User(name=name, username=username, password=generate_password_hash(password))

        db.session.add(new_user)
        db.session.commit()
        session['user_id'] = new_user.id
        return make_response(new_user.to_dict(rules = ('-_password_hash', )), 200)
api.add_resource(Signup, '/signup')


class Login(Resource):
    def post(self):
        try:
            data = request.get_json()
            username = data.get('username')
            password = data.get('password')
            user = User.query.filter_by(username=username).first()

            if user and check_password_hash(user.password, password):
                session['user_id'] = user.id
                return make_response(user.to_dict(rules=('-_password_hash',)), 200)
            else:
                abort(401, "Unauthorized")
        except:
            abort(401, "Unauthorized")


api.add_resource(Login, '/login')

class AuthorizedSession(Resource):
    def get(self):
        user_id = session.get('user_id')
        if user_id:
            user = User.query.get(user_id)
            if user:
                return make_response(user.to_dict(), 200)
        return make_response(jsonify(message='Unauthorized'), 401)

api.add_resource(AuthorizedSession, '/authorized-session')


class Cards(Resource):
    @staticmethod
    def to_dict(card):
        return {
            'id': card.id,
            'name': card.name,
            'card_type': card.card_type,
            'desc': card.desc,
            'race': card.race,
            'img': card.img,
            'tcgplayer_price': card.tcgplayer_price
        }

    def get(self):
        cards = [self.to_dict(card) for card in Card.query.all()]
        response = make_response(jsonify(cards), 200)
        return response

api.add_resource(Cards, '/cards')

class CardByID (Resource):
    def get (self, id):
        try:
            card = Card.query.get(id).to_dict()
            response = make_response(jsonify(card), 200)
            return response
        except:
            response = make_response("card not found", 404)
            return response

api.add_resource(CardByID, '/cards/<int:id>')

class Decks(Resource):
    def get(self):
        decks = [deck.to_dict() for deck in Deck.query.all()]
        response = make_response(jsonify(decks), 200)
        return response

    def post(self):
        data = request.get_json()
        try:
            new_deck = Deck(
                name=data['name'],
                user_id=data['user_id']
            )

            db.session.add(new_deck)
            db.session.commit()
            response = make_response("Deck created successfully", 201)
            return response
        except:
            response = make_response("Deck not created successfully", 400)
            return response

    
    def patch(self):
        data = request.get_json()
        deck_id = data.get('id')
        new_name = data.get('name')
        deck = Deck.query.get(deck_id)

        deck.name = new_name
        db.session.commit()
        response = make_response("Deck name updated successfully", 200)
        return response

api.add_resource(Decks, '/decks')


class DeckByID(Resource):
    def get(self, deck_id):
        deck = Deck.query.get(deck_id)
        if not deck:
            response = make_response("Deck not found", 404)
            return response

        response = make_response(deck.to_dict(), 200)
        return response
    
    def delete(self, deck_id):
        deck = Deck.query.get(deck_id)
        if not deck:
            response = make_response("Deck not found", 404)
            return response

        # Delete associated cards from deck_cards association table
        db.session.execute(deck_cards.delete().where(deck_cards.c.deck_id == deck_id))

        db.session.delete(deck)
        db.session.commit()
        response = make_response("Deck and associated cards deleted successfully", 200)

        return response


    def patch(self, deck_id):
        data = request.get_json()
        new_name = data.get('name')
        deck = Deck.query.get(deck_id)

        deck.name = new_name
        db.session.commit()
        response = make_response("Deck name updated successfully", 200)
        return response

api.add_resource(DeckByID, '/decks/<int:deck_id>')


class DeckCards(Resource):
    def get(self, deck_id):
        deck = Deck.query.get(deck_id)

        cards = [card.to_dict() for card in deck.cards]
        response = make_response(jsonify(cards), 200)
        return response
    
    def post(self, deck_id):
        data = request.get_json()
        card_ids = data.get('card_ids', [])
        
        deck = Deck.query.get(deck_id)
        
        for card_id in card_ids:
            card = Card.query.get(card_id)
            if card:
                deck.cards.append(card) 
    
        db.session.commit()
        
        response = make_response("Cards added to deck successfully", 200)
        return response
    
    def delete(self, deck_id):
        data = request.get_json()
        card_ids = data.get('card_id', [])
        deck = Deck.query.get(deck_id)

        for card_id in card_ids:
            card = Card.query.get(card_id)
            if card:
                if card in deck.cards:
                    deck.cards.remove(card)

        db.session.commit()

        response = make_response("Card removed from deck successfully", 200)
        return response


api.add_resource(DeckCards, '/decks/<int:deck_id>/cards')


if __name__ == '__main__':
    app.run(port=5555)
