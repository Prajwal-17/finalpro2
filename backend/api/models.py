from django.db import models


class Article(models.Model):
    slug = models.SlugField(unique=True)
    title = models.CharField(max_length=200)
    summary = models.TextField()
    category = models.CharField(max_length=100)
    published_at = models.DateField()
    source_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-published_at', 'title']

    def __str__(self) -> str:
        return self.title


class RegistrationRequest(models.Model):
    role = models.CharField(max_length=32, default='parent')
    full_name = models.CharField(max_length=255)
    email = models.EmailField()
    password_hash = models.CharField(max_length=128)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'{self.full_name} ({self.email})'


class LoginAttempt(models.Model):
    role = models.CharField(max_length=32)
    is_successful = models.BooleanField(default=True)
    payload = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self) -> str:
        return f'{self.role} at {self.created_at:%Y-%m-%d %H:%M:%S}'

# Create your models here.
