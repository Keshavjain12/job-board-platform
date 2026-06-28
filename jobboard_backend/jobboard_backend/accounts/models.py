from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    class Role(models.TextChoices):
        EMPLOYER = 'employer', 'Employer'
        SEEKER = 'seeker', 'Job Seeker'

    role = models.CharField(max_length=10, choices=Role.choices, default=Role.SEEKER)
    company_name = models.CharField(max_length=255, blank=True, default='')

    def __str__(self):
        return f'{self.username} ({self.role})'

    @property
    def is_employer(self):
        return self.role == self.Role.EMPLOYER

    @property
    def is_seeker(self):
        return self.role == self.Role.SEEKER
