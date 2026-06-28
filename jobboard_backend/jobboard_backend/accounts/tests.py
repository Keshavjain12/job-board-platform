import pytest
from django.urls import reverse
from rest_framework import status

from accounts.models import User


@pytest.mark.django_db
class TestRegistration:
    def test_register_seeker_success(self, api_client):
        url = reverse('register')
        payload = {
            'username': 'newseeker',
            'email': 'newseeker@example.test',
            'password': 'StrongPass123',
            'password2': 'StrongPass123',
            'role': 'seeker',
        }
        response = api_client.post(url, payload)
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(username='newseeker').exists()

    def test_register_password_mismatch_fails(self, api_client):
        url = reverse('register')
        payload = {
            'username': 'mismatch',
            'email': 'mismatch@example.test',
            'password': 'StrongPass123',
            'password2': 'DifferentPass123',
            'role': 'seeker',
        }
        response = api_client.post(url, payload)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_register_employer_requires_company_name(self, api_client):
        url = reverse('register')
        payload = {
            'username': 'noco',
            'email': 'noco@example.test',
            'password': 'StrongPass123',
            'password2': 'StrongPass123',
            'role': 'employer',
        }
        response = api_client.post(url, payload)
        assert response.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.django_db
class TestLogin:
    def test_login_success_returns_tokens_and_user(self, api_client, seeker):
        url = reverse('login')
        response = api_client.post(url, {'username': 'jane_seeker', 'password': 'StrongPass123'})
        assert response.status_code == status.HTTP_200_OK
        assert 'access' in response.data
        assert 'refresh' in response.data
        assert response.data['user']['username'] == 'jane_seeker'

    def test_login_wrong_password_fails(self, api_client, seeker):
        url = reverse('login')
        response = api_client.post(url, {'username': 'jane_seeker', 'password': 'WrongPassword'})
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_me_requires_authentication(self, api_client):
        url = reverse('me')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_me_returns_current_user(self, seeker_client, seeker):
        url = reverse('me')
        response = seeker_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data['username'] == seeker.username
