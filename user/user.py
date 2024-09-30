#pip install Flask Flask-SQLAlchemy Flask-Migrate Flask-Bcrypt Flask-JWT-Extended Flask-Cors

from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta


app = Flask(__name__)

# Configurations for the database and JWT
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///book_loan_system.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'pippo'  # Change this!!
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

CORS(app)

# Initialize the extensions
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Define the User model
class User(db.Model):
    username = db.Column(db.String(80), primary_key=True)
    password = db.Column(db.String(128), nullable=False)
    telephone = db.Column(db.String(15))
    social_media = db.Column(db.String(120))
    name = db.Column(db.String(80), nullable=False)
    surname = db.Column(db.String(80), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    address = db.Column(db.String(200))

# Define the Review model
class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    author_id = db.Column(db.String(80), db.ForeignKey('user.username'))
    score = db.Column(db.Integer, nullable=False)
    target_user_id = db.Column(db.String(80), db.ForeignKey('user.username'))


# Route to register a new user
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = bcrypt.generate_password_hash(data['password']).decode('utf-8')
    
    new_user = User(
        username=data['username'],
        password=hashed_password,
        telephone=data.get('telephone'),
        social_media=data.get('social_media'),
        name=data['name'],
        surname=data['surname'],
        email=data['email'],
        address=data['address']
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({"message": "User registered successfully"}), 201

# Route to login a user
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    
    if user and bcrypt.check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity=user.username)
        return jsonify(access_token=access_token), 200
    return jsonify({"message": "Invalid username or password"}), 401

# Route to update a user's info
@app.route('/user/<username>', methods=['PUT'])
@jwt_required()
def update_user(username):
    current_user = get_jwt_identity()
    if current_user != username:
        return jsonify({"message": "Unauthorized"}), 403
    
    data = request.get_json()
    user = User.query.filter_by(username=username).first()
    if user:
        for key, value in data.items():
            setattr(user, key, value)
        db.session.commit()
        return jsonify({"message": "User updated successfully"}), 200
    return jsonify({"message": "User not found"}), 404

# Route to delete a user
@app.route('/user/<username>', methods=['DELETE'])
@jwt_required()
def delete_user(username):
    current_user = get_jwt_identity()
    if current_user != username:
        return jsonify({"message": "Unauthorized"}), 403
    
    user = User.query.filter_by(username=username).first()
    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"message": "User deleted successfully"}), 200
    return jsonify({"message": "User not found"}), 404

# Route to retrieve specific user info
@app.route('/user/<username>', methods=['GET'])
@jwt_required()
def get_user(username):
    current_user = get_jwt_identity()
    if current_user != username:
        return jsonify({"message": "Unauthorized"}), 403
    
    user = User.query.filter_by(username=username).first()
    if user:
        user_info = {
            "name": user.name,
            "surname": user.surname,
            "username": user.username, 
            "address": user.address,
            "telephone": user.telephone,
            "email": user.email,
            "social_media": user.social_media,
        }
        return jsonify(user_info), 200
    return jsonify({"message": "User not found"}), 404



# Route to insert a review for a target user
@app.route('/review', methods=['POST'])
@jwt_required()
def insert_review():
    current_user = get_jwt_identity()
    data = request.get_json()
    
    new_review = Review(
        author_id=current_user,
        score=data['score'],
        target_user_id=data['target_user_id']
    )
    
    db.session.add(new_review)
    db.session.commit()
    
    return jsonify({"message": "Review submitted successfully"}), 201

# Route to retrieve all reviews for a specific user
@app.route('/reviews/<target_user_id>', methods=['GET'])
def get_reviews(target_user_id):
    reviews = Review.query.filter_by(target_user_id=target_user_id).all()
    review_list = [{"id": review.id, "author_id": review.author_id, "score": review.score} for review in reviews]
    
    return jsonify(review_list), 200




if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(host='0.0.0.0', port=5004, debug=True) 

