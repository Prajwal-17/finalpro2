import json
from datetime import date

from django.test import Client, TestCase
from django.urls import reverse

from .models import Article, RegistrationRequest


class ApiEndpointsTests(TestCase):
    def setUp(self):
        self.client = Client()

    def test_healthcheck_returns_ok(self):
        response = self.client.get(reverse('api:health'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'status': 'ok'})

    def test_news_returns_placeholder_when_empty(self):
        response = self.client.get(reverse('api:news-list'))
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIsInstance(payload, list)
        self.assertGreater(len(payload), 0)

    def test_news_returns_db_articles_when_available(self):
        Article.objects.create(
            slug='demo-article',
            title='Demo Article',
            summary='Summary',
            category='General',
            published_at=date(2025, 1, 1),
        )
        response = self.client.get(reverse('api:news-list'))
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertEqual(payload[0]['id'], 'demo-article')

    def test_register_parent_creates_request(self):
        response = self.client.post(
            reverse('api:register-parent'),
            data=json.dumps(
                {
                    'role': 'parent',
                    'parentName': 'Demo Parent',
                    'email': 'parent@example.com',
                    'password': 'safe-password',
                }
            ),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 201)
        self.assertTrue(
            RegistrationRequest.objects.filter(email='parent@example.com').exists()
        )

    def test_login_placeholder_requires_role(self):
        response = self.client.post(
            reverse('api:login-placeholder'),
            data=json.dumps({}),
            content_type='application/json',
        )
        self.assertEqual(response.status_code, 400)

# Create your tests here.
