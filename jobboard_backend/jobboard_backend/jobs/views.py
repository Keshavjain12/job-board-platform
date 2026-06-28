from django.db.models import Q
from rest_framework import permissions, viewsets
from rest_framework.exceptions import PermissionDenied

from .filters import ApplicationFilter, JobListingFilter
from .models import Application, ApplicantProfile, JobListing
from .permissions import (
    IsApplicantOrJobOwner, IsEmployer, IsOwnerOfJob, IsProfileOwner, IsSeeker,
)
from .serializers import ApplicantProfileSerializer, ApplicationSerializer, JobListingSerializer


class JobListingViewSet(viewsets.ModelViewSet):
    queryset = JobListing.objects.select_related('employer').all()
    serializer_class = JobListingSerializer
    filterset_class = JobListingFilter
    search_fields = ['title', 'description', 'location']
    ordering_fields = ['created_at', 'salary_min', 'salary_max']

    def get_permissions(self):
        if self.action in ('create',):
            return [permissions.IsAuthenticated(), IsEmployer()]
        if self.action in ('update', 'partial_update', 'destroy'):
            return [permissions.IsAuthenticated(), IsOwnerOfJob()]
        return [permissions.IsAuthenticatedOrReadOnly()]

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        if user.is_authenticated and getattr(user, 'is_employer', False):
            return qs.filter(Q(is_active=True) | Q(employer=user))
        return qs.filter(is_active=True)


class ApplicantProfileViewSet(viewsets.ModelViewSet):
    queryset = ApplicantProfile.objects.select_related('user').all()
    serializer_class = ApplicantProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsProfileOwner]

    def get_queryset(self):
        user = self.request.user
        if user.is_employer:
            return ApplicantProfile.objects.select_related('user').all()
        return ApplicantProfile.objects.select_related('user').filter(user=user)

    def perform_create(self, serializer):
        if ApplicantProfile.objects.filter(user=self.request.user).exists():
            raise PermissionDenied('Profile already exists; use PATCH to update it.')
        serializer.save()


class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer
    filterset_class = ApplicationFilter

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.IsAuthenticated(), IsSeeker()]
        return [permissions.IsAuthenticated(), IsApplicantOrJobOwner()]

    def get_queryset(self):
        user = self.request.user
        base = Application.objects.select_related('job', 'job__employer', 'applicant')
        if user.is_employer:
            return base.filter(Q(job__employer=user) | Q(applicant=user))
        return base.filter(applicant=user)

    def perform_update(self, serializer):
        user = self.request.user
        instance = self.get_object()
        if user.is_employer and instance.job.employer_id == user.id:
            serializer.save()
        elif instance.applicant_id == user.id:
            serializer.save()
        else:
            raise PermissionDenied("You don't have permission to modify this application.")
