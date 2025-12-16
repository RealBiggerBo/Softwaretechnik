from django.test import TestCase
from django.urls import reverse

# Create your tests here.
class HelloApiTest(TestCase):
    def test_hello_endpoint_returns_message(self):
        url = reverse("hello-world")
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"message": "Hello from Django API"})