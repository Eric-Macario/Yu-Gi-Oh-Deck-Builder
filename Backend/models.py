from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

deck_cards = db.Table(
    'deck_cards',
    db.Column('deck_id', db.Integer, db.ForeignKey('decks.id'), primary_key=True),
    db.Column('card_id', db.Integer, db.ForeignKey('cards.id'), primary_key=True)
)

collection_cards = db.Table(
    'collection_cards',
    db.Column('collection_id', db.Integer, db.ForeignKey('collections.id'), primary_key=True),
    db.Column('card_id', db.Integer, db.ForeignKey('cards.id'), primary_key=True)
)

wishlist_cards = db.Table(
    'wishlist_cards',
    db.Column('wishlist_id', db.Integer, db.ForeignKey('wishlists.id'), primary_key=True),
    db.Column('card_id', db.Integer, db.ForeignKey('cards.id'), primary_key=True)
)

class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    password = db.Column(db.String, nullable=False)
    name = db.Column(db.String)
    created_at = db.Column(db.DateTime)
    avatar = db.Column(db.String)
    collections = db.relationship('Collection', back_populates='user')
    wishlist = db.relationship('Wishlist', back_populates='user')
    decks = db.relationship('Deck', back_populates='user')

class Card(db.Model):
    __tablename__ = 'cards'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    card_type = db.Column(db.String)
    desc = db.Column(db.String)
    race = db.Column(db.String)
    img = db.Column(db.String)
    tcgplayer_price = db.Column(db.Float)
    collections = db.relationship('Collection', secondary=collection_cards, back_populates='cards')
    wishlists = db.relationship('Wishlist', secondary=wishlist_cards, back_populates='cards')
    decks = db.relationship('Deck', secondary=deck_cards, back_populates='cards')

class Collection(db.Model):
    __tablename__ = 'collections'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    cards = db.relationship('Card', secondary=collection_cards, back_populates='collections')
    user = db.relationship('User', back_populates='collections')

class Deck(db.Model):
    __tablename__ = 'decks'
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    cards = db.relationship('Card', secondary=deck_cards, back_populates='decks')
    card = db.relationship('Card', back_populates='decks')
    user = db.relationship('User', back_populates='decks')

class Wishlist(db.Model):
    __tablename__ = 'wishlists'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    cards = db.relationship('Card', secondary=wishlist_cards, back_populates='wishlists')
    user = db.relationship('User', back_populates='wishlist')
