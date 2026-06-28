from rest_framework import serializers
from accounts.serializers import UserSerializer
from .models import Application, ApplicantProfile, JobListing


class JobListingSerializer(serializers.ModelSerializer):
    employer = UserSerializer(read_only=True)
    application_count = serializers.IntegerField(source='applications.count', read_only=True)

    class Meta:
        model = JobListing
        fields = [
            'id', 'employer', 'title', 'description', 'location', 'job_type',
            'salary_min', 'salary_max', 'is_active', 'application_count',
            'created_at', 'updated_at',
        ]
        read_only_fields = ['id', 'employer', 'created_at', 'updated_at']

    def validate(self, attrs):
        salary_min = attrs.get('salary_min', getattr(self.instance, 'salary_min', None))
        salary_max = attrs.get('salary_max', getattr(self.instance, 'salary_max', None))
        if salary_min and salary_max and salary_min > salary_max:
            raise serializers.ValidationError('salary_min cannot be greater than salary_max.')
        return attrs

    def create(self, validated_data):
        validated_data['employer'] = self.context['request'].user
        return super().create(validated_data)


class ApplicantProfileSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = ApplicantProfile
        fields = ['id', 'user', 'headline', 'bio', 'skills', 'resume', 'updated_at']
        read_only_fields = ['id', 'user', 'updated_at']

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class ApplicationSerializer(serializers.ModelSerializer):
    applicant = UserSerializer(read_only=True)
    job_title = serializers.CharField(source='job.title', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'job', 'job_title', 'applicant', 'cover_letter', 'resume',
            'status', 'applied_at', 'updated_at',
        ]
        read_only_fields = ['id', 'applicant', 'applied_at', 'updated_at']

    def validate_job(self, job):
        if not job.is_active:
            raise serializers.ValidationError('This job listing is no longer accepting applications.')
        user = self.context['request'].user
        if Application.objects.filter(job=job, applicant=user).exists():
            raise serializers.ValidationError('You have already applied to this job.')
        return job

    def create(self, validated_data):
        validated_data['applicant'] = self.context['request'].user
        return super().create(validated_data)
