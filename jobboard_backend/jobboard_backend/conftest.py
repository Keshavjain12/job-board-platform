import pytest
from rest_framework.test import APIClient

from accounts.models import User


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def employer(db):
    return User.objects.create_user(
        username='acme_employer',
        password='StrongPass123',
        role=User.Role.EMPLOYER,
        company_name='Acme Corp',
        email='employer@acme.test',
    )


@pytest.fixture
def seeker(db):
    return User.objects.create_user(
        username='jane_seeker',
        password='StrongPass123',
        role=User.Role.SEEKER,
        email='jane@example.test',
    )


@pytest.fixture
def employer_client(api_client, employer):
    api_client.force_authenticate(user=employer)
    return api_client


@pytest.fixture
def seeker_client(api_client, seeker):
    api_client.force_authenticate(user=seeker)
    return api_client
