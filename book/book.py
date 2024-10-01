#!pip install Flask Flask-SQLAlchemy Flask-Migrate elasticsearch

# config.py
import os

class Config:
    SQLALCHEMY_DATABASE_URI = 'sqlite:///books.db'  # SQLite for simplicity
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    #ELASTICSEARCH_URL = 'http://localhost:9200'


# models.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Book(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    author = db.Column(db.String, nullable=False)
    genre = db.Column(db.String, nullable=False)
    year = db.Column(db.Integer)
    status = db.Column(db.String, default='available')
    language = db.Column(db.String)
    description = db.Column(db.String)
    owner = db.Column(db.String)

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String, nullable = True)
    score = db.Column(db.Integer, nullable=False)
    username = db.Column(db.String, nullable=False)
    book_id = db.Column(db.Integer, db.ForeignKey('book.id'), nullable=False)

# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

#from models import db, Book, Review
#from elasticsearch import Elasticsearch
#from config import Config

app = Flask(__name__)

CORS(app)

app.config.from_object(Config)
db.init_app(app)

# Initialize Elasticsearch client
#es = Elasticsearch([Config.ELASTICSEARCH_URL])
'''
@app.before_first_request
def create_tables():
    db.create_all()
'''
@cross_origin
@app.route('/books', methods=['POST'])
def add_book():
    data = request.json
    new_book = Book(**data)
    db.session.add(new_book)
    db.session.commit()
    
    #es.index(index='books', id=new_book.id, body=data)  # Index book in Elasticsearch
    return jsonify({'message': 'Book added', 'id': new_book.id, 'owner':new_book.owner}), 201

@app.route('/books', methods=['GET'])
def get_books():
    owner = request.args.get('owner_id')
    books = Book.query.filter_by(owner=owner).all()
    books_list = [{'id': book.id, 'title': book.title, 'author': book.author, 'genre': book.genre, 'year': book.year, 'language': book.language, 'description': book.description, 'owner':book.owner} for book in books]
    return jsonify(books_list), 200


@app.route('/books/<book_id>', methods=['PUT'])
def update_book(book_id):
    data = request.json
    #book = Book.query.get_or_404(book_id)
    book = db.session.get(Book, book_id)
    for key, value in data.items():
        setattr(book, key, value)
    db.session.commit()
    
    #es.index(index='books', id=book.id, body=data)  # Update Elasticsearch index
    return jsonify({'message': 'Book updated'})

@app.route('/books/<book_id>', methods=['DELETE'])
def delete_book(book_id):
    #book = Book.query.get_or_404(book_id)
    book = db.session.get(Book, book_id)
    db.session.delete(book)
    db.session.commit()
    
    #es.delete(index='books', id=book_id)  # Remove from Elasticsearch
    return jsonify({'message': 'Book deleted'})

@app.route('/books/<book_id>/reviews', methods=['POST'])
def add_review(book_id):
    data = request.json
    new_review = Review(**data)
    db.session.add(new_review)
    db.session.commit()
    return jsonify({'message': 'Review added', 'id': new_review.id}), 201

@app.route('/books/<book_id>/reviews', methods=['GET'])
def get_reviews(book_id):
    reviews = Review.query.filter_by(book_id=book_id).all()
    return jsonify([{'id': review.id, 'username': review.username, 'description': review.description, 'score': review.score, 'book_id': review.book_id} for review in reviews])

@app.route('/search', methods=['GET'])
def search_books():
    query = request.args.get('q')
    books = Book.query.filter(Book.title.contains(query) | Book.author.contains(query)).all()
    books_list = [{'id': book.id, 'title': book.title, 'author': book.author, 'genre': book.genre, 'year': book.year, 'language': book.language, 'status': book.status, 'description': book.description, 'owner':book.owner } for book in books]
    return jsonify(books_list)


if __name__ == '__main__':
	with app.app_context():
		db.create_all()
	app.run(host='0.0.0.0', port=5001, debug=True) 
