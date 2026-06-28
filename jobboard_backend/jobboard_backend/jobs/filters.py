import django_filters as filters

from .models import Application, JobListing


class JobListingFilter(filters.FilterSet):
    location = filters.CharFilter(field_name='location', lookup_expr='icontains')
    job_type = filters.ChoiceFilter(choices=JobListing.JobType.choices)
    title = filters.CharFilter(field_name='title', lookup_expr='icontains')
    salary_min = filters.NumberFilter(field_name='salary_min', lookup_expr='gte')

    class Meta:
        model = JobListing
        fields = ['location', 'job_type', 'title', 'salary_min', 'is_active']


class ApplicationFilter(filters.FilterSet):
    status = filters.ChoiceFilter(choices=Application.Status.choices)
    job = filters.NumberFilter(field_name='job_id')

    class Meta:
        model = Application
        fields = ['status', 'job']
