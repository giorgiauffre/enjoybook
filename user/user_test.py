import unittest
import json
from utente_flask import app, db, User, Review  # Ensure your app name is correctly imported

class FlaskAPITestCase(unittest.TestCase):

    def setUp(self):
        # Set up a test client and initialize the test database
        self.app = app
        self.app.config['TESTING'] = True
        self.app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'  # In-memory database
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()

    def tearDown(self):
        # Drop all tables after tests
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def register_user(self, username, password, email):
        return self.client.post('/register', json={
            'username': username,
            'password': password,
            'email': email,
            'name': 'Test',
            'surname': 'User',
            'telephone': '123456789',
            'social_media': 'test_user',
            'address': '123 Test St.'
        })

    def login_user(self, username, password):
        return self.client.post('/login', json={
            'username': username,
            'password': password
        })

    def test_register_user(self):
        response = self.register_user('testuser', 'password', 'test@example.com')
        self.assertEqual(response.status_code, 201)
        self.assertIn(b'User registered successfully', response.data)

    def test_login_user(self):
        self.register_user('testuser', 'password', 'test@example.com')
        response = self.login_user('testuser', 'password')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'access_token', response.data)

    def test_update_user(self):
        self.register_user('testuser', 'password', 'test@example.com')
        login_response = self.login_user('testuser', 'password')
        access_token = json.loads(login_response.data)['access_token']
        
        response = self.client.put('/user/testuser', 
                                    json={'telephone': '987654321'},
                                    headers={'Authorization': f'Bearer {access_token}'})
        
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'User updated successfully', response.data)

    def test_delete_user(self):
        self.register_user('testuser', 'password', 'test@example.com')
        login_response = self.login_user('testuser', 'password')
        access_token = json.loads(login_response.data)['access_token']
        
        response = self.client.delete('/user/testuser', 
                                       headers={'Authorization': f'Bearer {access_token}'})
        
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'User deleted successfully', response.data)

    def test_get_user(self):
        self.register_user('testuser', 'password', 'test@example.com')
        login_response = self.login_user('testuser', 'password')
        access_token = json.loads(login_response.data)['access_token']

        response = self.client.get('/user/testuser', 
                                    headers={'Authorization': f'Bearer {access_token}'})
        
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Test', response.data)  # Check for name element in response

    def test_insert_review(self):
        self.register_user('testauthor', 'password', 'author@example.com')
        self.register_user('testtarget', 'password', 'target@example.com')
        
        login_response = self.login_user('testauthor', 'password')
        access_token = json.loads(login_response.data)['access_token']

        response = self.client.post('/review', 
                                     json={'score': 5, 'target_user_id': 'testtarget'}, 
                                     headers={'Authorization': f'Bearer {access_token}'})
        
        self.assertEqual(response.status_code, 201)
        self.assertIn(b'Review submitted successfully', response.data)

    def test_get_reviews(self):
        self.register_user('testauthor', 'password', 'author@example.com')
        self.register_user('testtarget', 'password', 'target@example.com')

        login_response = self.login_user('testauthor', 'password')
        access_token = json.loads(login_response.data)['access_token']
        
        self.client.post('/review', 
                         json={'score': 5, 'target_user_id': 'testtarget'}, 
                         headers={'Authorization': f'Bearer {access_token}'})

        self.client.post('/review', 
                             json={'score': 7, 'target_user_id': 'testtarget'}, 
                             headers={'Authorization': f'Bearer {access_token}'})
        
        response = self.client.get('/reviews/testtarget')
        self.assertEqual(response.status_code, 200)
        #print(response.data)
        self.assertIn(b'author_id', response.data)  # Check for target user ID in response

if __name__ == '__main__':
    unittest.main()
