import pytest
from django.urls import reverse
from rest_framework import status

from jobs.models import Application, JobListing


def make_job(employer, **kwargs):
    defaults = dict(
        employer=employer,
        title='Backend Engineer',
        description='Build APIs with Django.',
        location='Remote',
        job_type=JobListing.JobType.REMOTE,
    )
    defaults.update(kwargs)
    return JobListing.objects.create(**defaults)


@pytest.mark.django_db
class TestJobListings:
    def test_employer_can_create_job(self, employer_client):
        url = reverse('job-list')
        payload = {
            'title': 'Frontend Developer',
            'description': 'React + hooks.',
            'location': 'Austin, TX',
            'job_type': 'full_time',
            'salary_min': 70000,
            'salary_max': 90000,
        }
        response = employer_client.post(url, payload)
        assert response.status_code == status.HTTP_201_CREATED
        assert JobListing.objects.count() == 1
        assert JobListing.objects.first().employer.username == 'acme_employer'

    def test_seeker_cannot_create_job(self, seeker_client):
        url = reverse('job-list')
        payload = {
            'title': 'Frontend Developer',
            'description': 'React + hooks.',
            'location': 'Austin, TX',
            'job_type': 'full_time',
        }
        response = seeker_client.post(url, payload)
        assert response.status_code == status.HTTP_403_FORBIDDEN

    def test_anonymous_user_can_list_active_jobs(self, api_client, employer):
        make_job(employer, title='Visible Job', is_active=True)
        make_job(employer, title='Hidden Job', is_active=False)
        url = reverse('job-list')
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        titles = [j['title'] for j in response.data['results']]
        assert 'Visible Job' in titles
        assert 'Hidden Job' not in titles

    def test_filter_jobs_by_location(self, api_client, employer):
        make_job(employer, title='Remote Job', location='Remote')
        make_job(employer, title='NYC Job', location='New York, NY')
        url = reverse('job-list')
        response = api_client.get(url, {'location': 'New York'})
        titles = [j['title'] for j in response.data['results']]
        assert titles == ['NYC Job']

    def test_other_employer_cannot_edit_job(self, api_client, employer, seeker):
        job = make_job(employer)
        from accounts.models import User
        other_employer = User.objects.create_user(
            username='other_employer', password='StrongPass123',
            role=User.Role.EMPLOYER, company_name='OtherCo',
        )
        api_client.force_authenticate(user=other_employer)
        url = reverse('job-detail', args=[job.id])
        response = api_client.patch(url, {'title': 'Hijacked title'})
        assert response.status_code == status.HTTP_403_FORBIDDEN


@pytest.mark.django_db
class TestApplications:
    def test_seeker_can_apply_to_job(self, seeker_client, employer):
        job = make_job(employer)
        url = reverse('application-list')
        response = seeker_client.post(url, {'job': job.id, 'cover_letter': 'I would love to join.'})
        assert response.status_code == status.HTTP_201_CREATED
        assert Application.objects.count() == 1

    def test_seeker_cannot_apply_twice_to_same_job(self, seeker_client, employer, seeker):
        job = make_job(employer)
        Application.objects.create(job=job, applicant=seeker)
        url = reverse('application-list')
        response = seeker_client.post(url, {'job': job.id})
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_employer_can_update_application_status(self, employer_client, employer, seeker):
        job = make_job(employer)
        application = Application.objects.create(job=job, applicant=seeker)
        url = reverse('application-detail', args=[application.id])
        response = employer_client.patch(url, {'status': 'interview'})
        assert response.status_code == status.HTTP_200_OK
        application.refresh_from_db()
        assert application.status == 'interview'

    def test_unrelated_user_cannot_view_application(self, api_client, employer, seeker):
        job = make_job(employer)
        application = Application.objects.create(job=job, applicant=seeker)

        from accounts.models import User
        stranger = User.objects.create_user(
            username='stranger', password='StrongPass123', role=User.Role.SEEKER,
        )
        api_client.force_authenticate(user=stranger)
        url = reverse('application-detail', args=[application.id])
        response = api_client.get(url)
        assert response.status_code == status.HTTP_404_NOT_FOUND
