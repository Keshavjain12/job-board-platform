from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import ApplicantProfileViewSet, ApplicationViewSet, JobListingViewSet

router = DefaultRouter()
router.register('jobs', JobListingViewSet, basename='job')
router.register('profiles', ApplicantProfileViewSet, basename='profile')
router.register('applications', ApplicationViewSet, basename='application')

urlpatterns = [
    path('', include(router.urls)),
]
