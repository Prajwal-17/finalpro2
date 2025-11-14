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


class Quiz(models.Model):
    """Stores quiz level information"""
    level = models.IntegerField(unique=True)
    title = models.CharField(max_length=255)
    badge_name = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['level']

    def __str__(self) -> str:
        return f'{self.title} (Level {self.level})'


class Question(models.Model):
    """Stores individual quiz questions"""
    quiz = models.ForeignKey(Quiz, related_name='questions', on_delete=models.CASCADE)
    question_text = models.TextField()
    options = models.JSONField(default=list)  # List of option strings
    correct_answer = models.TextField()  # The correct option text
    order = models.IntegerField(default=0)  # Order within the quiz

    class Meta:
        ordering = ['quiz', 'order']

    def __str__(self) -> str:
        return f'{self.quiz.title} - Q{self.order + 1}'


class QuizAttempt(models.Model):
    """Tracks when a child attempts a quiz"""
    child_email = models.EmailField()  # Using email as identifier
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    score = models.IntegerField(default=0)
    total_questions = models.IntegerField(default=0)
    is_completed = models.BooleanField(default=False)

    class Meta:
        ordering = ['-started_at']

    def __str__(self) -> str:
        return f'{self.child_email} - {self.quiz.title} ({self.score}/{self.total_questions})'


class QuestionResponse(models.Model):
    """Stores individual question responses within a quiz attempt"""
    attempt = models.ForeignKey(QuizAttempt, related_name='responses', on_delete=models.CASCADE)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    selected_answer = models.TextField()
    is_correct = models.BooleanField(default=False)
    answered_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['attempt', 'question__order']

    def __str__(self) -> str:
        return f'{self.attempt.child_email} - Q{self.question.order + 1} ({self.is_correct})'

# Create your models here.
