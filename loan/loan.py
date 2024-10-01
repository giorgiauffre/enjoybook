#!pip install Flask Flask-SQLAlchemy Flask-Migrate

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///loans.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)
migrate = Migrate(app, db)

CORS(app)

class Loan(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    owner = db.Column(db.String(50), nullable=False)
    booker = db.Column(db.String(50), nullable=False)
    book_id = db.Column(db.String(50), nullable=False)

    def serialize(self):
        return {
            'id': self.id,
            'owner': self.owner,
            'booker': self.booker,
            'book_id': self.book_id
        }

@app.route('/loans/<user_id>', methods=['GET'])
def get_loans(user_id):
    loans = Loan.query.filter((Loan.owner == user_id) | (Loan.booker == user_id)).all()
    return jsonify([loan.serialize() for loan in loans]), 200

@app.route('/loan', methods=['POST'])
def create_loan():
    data = request.get_json()
    owner = data.get('owner')
    booker = data.get('booker')
    book_id = data.get('book_id')

    if not owner or not booker or not book_id:
        return jsonify({'message': 'Missing data'}), 400

    new_loan = Loan(owner=owner, booker=booker, book_id=book_id)

    db.session.add(new_loan)
    db.session.commit()
    
    return jsonify(new_loan.serialize()), 201

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create database and table if not exists
    app.run(host='0.0.0.0', port=5002, debug=True) 

