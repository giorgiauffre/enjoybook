# test_app.py
import unittest
import json
from book import app, db, Book, Review

class APITestCase(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        
        # Create a new database for testing
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test_books.db'
        with app.app_context():
            db.create_all()
    
    def tearDown(self):
        # Clean up the database after tests
        with app.app_context():
            db.drop_all()

    def test_add_book(self):
        response = self.app.post('/books', 
                                 data=json.dumps({'title': 'Test Book', 'author': 'Test Author', 'genre': 'Fiction', 'year': 2021, 'owner': 'Pippo'}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('Book added', str(response.data))

    def test_update_book(self):
        # First, add a book
        response = self.app.post('/books', 
                                 data=json.dumps({'title': 'Book to Update', 'author': 'Author', 'genre': 'Genre', 'year': 2021}),
                                 content_type='application/json')
        book_id = json.loads(response.data)['id']
        
        # Now, update the book
        response = self.app.put(f'/books/{book_id}', 
                                data=json.dumps({'title': 'Updated Book Title'}),
                                content_type='application/json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Book updated', str(response.data))

    def test_delete_book(self):
        # First, add a book to delete
        response = self.app.post('/books', 
                                 data=json.dumps({'title': 'Book to Delete', 'author': 'Author', 'genre': 'Genre', 'year': 2021}),
                                 content_type='application/json')
        book_id = json.loads(response.data)['id']
        
        # Now, delete the book
        response = self.app.delete(f'/books/{book_id}')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Book deleted', str(response.data))

    def test_add_review(self):
        # First, add a book
        response = self.app.post('/books', 
                                 data=json.dumps({'title': 'Book for Review', 'author': 'Author', 'genre': 'Genre', 'year': 2021}),
                                 content_type='application/json')
        book_id = json.loads(response.data)['id']

        # Now, add a review
        response = self.app.post(f'/books/{book_id}/reviews',
                                 data=json.dumps({'score': 5, 'user_id': 1}),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 201)
        self.assertIn('Review added', str(response.data))

    def test_get_reviews(self):
        # First, add a book and a review
        response = self.app.post('/books', 
                                 data=json.dumps({'title': 'Book for Reviews', 'author': 'Author', 'genre': 'Genre', 'year': 2021}),
                                 content_type='application/json')
        book_id = json.loads(response.data)['id']
        self.app.post(f'/books/{book_id}/reviews',
                      data=json.dumps({'score': 5, 'user_id': 1}),
                      content_type='application/json')

        # Now, get the reviews
        response = self.app.get(f'/books/{book_id}/reviews')
        self.assertEqual(response.status_code, 200)
        self.assertIn('score', str(response.data))

    def test_search_books(self):
        # First, add a book to search for
        self.app.post('/books', 
                     data=json.dumps({'title': 'Searchable Book', 'author': 'Author', 'genre': 'Genre', 'year': 2021}),
                     content_type='application/json')

        # Now, search for the book
        response = self.app.get('/search?q=Searchable Book')
        self.assertEqual(response.status_code, 200)
        self.assertIn('Searchable Book', str(response.data))


if __name__ == "__main__":
    unittest.main()