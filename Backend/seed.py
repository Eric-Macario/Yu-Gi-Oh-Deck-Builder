from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from models import db, User, Deck
import os

app = Flask(__name__)

database_filename = 'database.db'
instance_folder = 'instance'
project_directory = os.getcwd()
database_path = os.path.join(project_directory, instance_folder, database_filename)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + database_path

db = SQLAlchemy(app)


@app.route('/')
def reset_tables():
    db.session.execute(text('DELETE FROM decks;'))
    db.session.execute(text('DELETE FROM users;'))
    db.session.execute(text('DELETE FROM deck_cards;'))
    db.session.execute(text('DELETE FROM collections;'))
    db.session.execute(text('DELETE FROM collection_cards;'))
    db.session.execute(text('DROP TABLE IF EXISTS users;'))
    db.session.execute(text('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT UNIQUE NOT NULL, password TEXT NOT NULL, name TEXT, created_at DATETIME, avatar TEXT);'))
    db.session.commit()
    return 'Tables reset successfully.'

if __name__ == '__main__':
    app.run()