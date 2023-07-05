from flask_sqlalchemy import SQLAlchemy
db = SQLAlchemy()


class Collection(db.Model):
    __tablename__ = 'collections'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    card_id = db.Column(db.Integer, db.ForeignKey('cards.id'))
    cards = db.relationship('Card', back_populates='collections')
    user = db.relationship('User', back_populates='collection')

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    name = db.Column(db.String)
    created_at = db.Column(db.DateTime)
    avatar = db.Column(db.String)
    collection = db.relationship('Collection', back_populates='user')
    wishlist = db.relationship('Wishlist', back_populates='user')
    deck = db.relationship('Deck', back_populates='user')

class Card(db.Model):
    __tablename__ = 'cards'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    type = db.Column(db.String)
    desc = db.Column(db.String)
    race = db.Column(db.String)
    img = db.Column(db.String)
    tcgplayer_price = db.Column(db.Float)
    collections = db.relationship('Collection', back_populates='cards')
    wishlists = db.relationship('Wishlist', back_populates='cards')
    decks = db.relationship('Deck', back_populates='card')

class Deck(db.Model):
    __tablename__ = 'decks'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    card_id = db.Column(db.Integer, db.ForeignKey('cards.id'))
    card = db.relationship('Card', back_populates='decks')
    user = db.relationship('User', back_populates='deck')

class Wishlist(db.Model):
    __tablename__ = 'wishlists'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    card_id = db.Column(db.Integer, db.ForeignKey('cards.id'))
    cards = db.relationship('Card', secondary='wishlist_cards', back_populates='wishlists')
    user = db.relationship('User', back_populates='wishlist')
