import unittest
import json
from prestito_flask import app, db, Loan

class APITestCase(unittest.TestCase):
    def setUp(self):
        # Create a test client
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()

        # Create all tables in the database
        db.create_all()

    def tearDown(self):
        # Drop all tables after testing
        db.session.remove()
        db.drop_all()
        self.app_context.pop()

    def test_create_loan(self):
        # Test POST /loans
        response = self.app.post('/loans', 
            data=json.dumps({'user1': 'Alice', 'user2': 'Bob', 'book_id': '123'}),
            content_type='application/json')

        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertEqual(data['user1'], 'Alice')
        self.assertEqual(data['user2'], 'Bob')
        self.assertEqual(data['book_id'], '123')

    def test_get_loans(self):
        # Add a loan first
        self.app.post('/loans', 
            data=json.dumps({'user1': 'Alice', 'user2': 'Bob', 'book_id': '123'}),
            content_type='application/json')

        # Test GET /loans/Alice
        response = self.app.get('/loans/Alice')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(len(data), 1)  # Ensure there's one loan

        # Check the loan details
        loan = data[0]
        self.assertEqual(loan['user1'], 'Alice')
        self.assertEqual(loan['user2'], 'Bob')
        self.assertEqual(loan['book_id'], '123')

    def test_get_loans_no_loans(self):
        # Test GET /loans/Charlie
        response = self.app.get('/loans/Charlie')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertEqual(len(data), 0)  # Ensure there are no loans

    def test_create_loan_missing_data(self):
        # Test POST /loans with missing data
        response = self.app.post('/loans', 
            data=json.dumps({'user1': 'Alice'}),
            content_type='application/json')

        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertEqual(data['message'], 'Missing data')


if __name__ == '__main__':
    unittest.main()
