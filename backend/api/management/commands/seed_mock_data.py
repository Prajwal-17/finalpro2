from datetime import date

from django.contrib.auth.hashers import make_password
from django.core.management import BaseCommand, call_command
from django.db import transaction
from django.utils import timezone

from api.models import (
    Article,
    LoginAttempt,
    Question,
    QuestionResponse,
    Quiz,
    QuizAttempt,
    RegistrationRequest,
)

ARTICLE_DATA = [
    {
        'slug': 'pocso-brief',
        'title': 'Understanding the POCSO Act in 2025',
        'summary': 'Updates to state-level guidelines and how Shield 360 aligns with the latest mandates.',
        'category': 'Legal Brief',
        'published_at': '2025-02-01',
        'source_url': 'https://www.example.com/articles/pocso-brief',
    },
    {
        'slug': 'community-playbook',
        'title': 'Community Playbook for Safer Schools',
        'summary': 'Insights from recent workshops with NGOs and school administrators in Bengaluru.',
        'category': 'Community',
        'published_at': '2025-01-18',
        'source_url': 'https://www.example.com/articles/community-playbook',
    },
    {
        'slug': 'ai-chatbot',
        'title': 'AI-Assisted Crisis Detection: Early Findings',
        'summary': 'How our chatbot pilot is identifying early warning signals and routing help faster.',
        'category': 'Product',
        'published_at': '2025-01-05',
        'source_url': 'https://www.example.com/articles/ai-chatbot',
    },
]

REGISTRATION_DATA = [
    {
        'role': 'parent',
        'full_name': 'Aarav Rao',
        'email': 'aarav.rao@example.com',
        'password': 'parents-rule',
        'metadata': {
            'childEmail': 'mia.rao@example.com',
            'city': 'Bengaluru',
            'preferredLanguage': 'en-IN',
        },
    },
    {
        'role': 'parent',
        'full_name': 'Sarah Mathews',
        'email': 'sarah.mathews@example.com',
        'password': 'shield360',
        'metadata': {
            'childEmail': 'vivaan.singh@example.com',
            'city': 'Hyderabad',
            'preferredLanguage': 'en-IN',
        },
    },
    {
        'role': 'teacher',
        'full_name': 'Mr. Kiran Gupta',
        'email': 'kiran.gupta@example.com',
        'password': 'teach-safe',
        'metadata': {
            'school': 'Rainbow Public School',
            'gradeRange': '4-6',
        },
    },
    {
        'role': 'counselor',
        'full_name': 'Dr. Nisha Fernandes',
        'email': 'nisha.fernandes@example.com',
        'password': 'counsel-care',
        'metadata': {
            'organization': 'Safe Steps NGO',
            'region': 'Karnataka',
        },
    },
]

LOGIN_ATTEMPTS = [
    {
        'role': 'parent',
        'is_successful': True,
        'payload': {
            'identifier': 'aarav.rao@example.com',
            'metadata': {'device': 'ios', 'appVersion': '1.0.0'},
        },
    },
    {
        'role': 'teacher',
        'is_successful': True,
        'payload': {
            'identifier': 'kiran.gupta@example.com',
            'metadata': {'device': 'web', 'ip': '122.18.1.44'},
        },
    },
    {
        'role': 'child',
        'is_successful': True,
        'payload': {
            'identifier': 'mia.rao@example.com',
            'metadata': {'device': 'android', 'appVersion': '0.9.2'},
        },
    },
]

QUIZ_ATTEMPTS = [
    {
        'child_email': 'mia.rao@example.com',
        'quiz_level': 1,
        'answered_questions': 5,
        'correct_answers': 4,
        'mark_completed': True,
    },
    {
        'child_email': 'mia.rao@example.com',
        'quiz_level': 2,
        'answered_questions': 3,
        'correct_answers': 2,
        'mark_completed': False,
    },
    {
        'child_email': 'vivaan.singh@example.com',
        'quiz_level': 1,
        'answered_questions': 5,
        'correct_answers': 5,
        'mark_completed': True,
    },
    {
        'child_email': 'vivaan.singh@example.com',
        'quiz_level': 3,
        'answered_questions': 5,
        'correct_answers': 2,
        'mark_completed': True,
    },
]


class Command(BaseCommand):
    help = 'Seed deterministic mock data for development & demos.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--purge',
            action='store_true',
            help='Delete previously seeded data before creating new records.',
        )

    def handle(self, *args, **options):
        purge = options['purge']

        with transaction.atomic():
            if purge:
                self._purge_seeded_data()

            self.stdout.write('Ensuring quiz catalog is loaded...')
            call_command('load_quiz_data')

            self._seed_articles()
            self._seed_registration_requests()
            self._seed_login_attempts()
            self._seed_quiz_attempts()

        self.stdout.write(self.style.SUCCESS('✅ Mock data seed completed'))

    # ------------------------------------------------------------------ helpers
    def _purge_seeded_data(self):
        self.stdout.write('Purging existing mock data...')
        QuestionResponse.objects.all().delete()
        QuizAttempt.objects.all().delete()
        LoginAttempt.objects.all().delete()
        RegistrationRequest.objects.all().delete()
        Article.objects.all().delete()
        self.stdout.write(self.style.WARNING('Previous data removed.'))

    def _seed_articles(self):
        self.stdout.write('Seeding articles...')
        for entry in ARTICLE_DATA:
            Article.objects.update_or_create(
                slug=entry['slug'],
                defaults={
                    'title': entry['title'],
                    'summary': entry['summary'],
                    'category': entry['category'],
                    'published_at': date.fromisoformat(entry['published_at']),
                    'source_url': entry['source_url'],
                },
            )
        self.stdout.write(self.style.SUCCESS(f'  -> {len(ARTICLE_DATA)} articles ready'))

    def _seed_registration_requests(self):
        self.stdout.write('Seeding registration requests...')
        for entry in REGISTRATION_DATA:
            RegistrationRequest.objects.update_or_create(
                email=entry['email'],
                defaults={
                    'role': entry['role'],
                    'full_name': entry['full_name'],
                    'password_hash': make_password(entry['password']),
                    'metadata': entry['metadata'],
                },
            )
        self.stdout.write(self.style.SUCCESS(f'  -> {len(REGISTRATION_DATA)} registrations ready'))

    def _seed_login_attempts(self):
        self.stdout.write('Seeding login attempts...')
        LoginAttempt.objects.all().delete()
        LoginAttempt.objects.bulk_create(
            [LoginAttempt(**payload) for payload in LOGIN_ATTEMPTS]
        )
        self.stdout.write(self.style.SUCCESS(f'  -> {len(LOGIN_ATTEMPTS)} login attempts logged'))

    def _seed_quiz_attempts(self):
        self.stdout.write('Seeding quiz attempts & responses...')
        QuestionResponse.objects.all().delete()
        QuizAttempt.objects.all().delete()

        for spec in QUIZ_ATTEMPTS:
            quiz = Quiz.objects.filter(level=spec['quiz_level']).first()
            if not quiz:
                self.stdout.write(
                    self.style.WARNING(
                        f'  -> Skipping level {spec["quiz_level"]}; quiz missing.'
                    )
                )
                continue

            total_questions = quiz.questions.count()
            answered_count = min(spec.get('answered_questions', total_questions), total_questions)
            correct_count = min(spec.get('correct_answers', 0), answered_count)

            attempt = QuizAttempt.objects.create(
                child_email=spec['child_email'],
                quiz=quiz,
                total_questions=total_questions,
                score=0,
                is_completed=spec.get('mark_completed', False),
                completed_at=timezone.now() if spec.get('mark_completed') else None,
            )

            questions = list(quiz.questions.order_by('order'))
            created_responses = 0

            for idx in range(answered_count):
                question = questions[idx]

                is_correct = idx < correct_count
                selected_answer = (
                    question.correct_answer
                    if is_correct
                    else self._pick_incorrect_option(question)
                )

                QuestionResponse.objects.create(
                    attempt=attempt,
                    question=question,
                    selected_answer=selected_answer,
                    is_correct=is_correct,
                )
                created_responses += 1

            attempt.score = correct_count
            if attempt.is_completed and attempt.completed_at is None:
                attempt.completed_at = timezone.now()
            attempt.save(update_fields=['score', 'completed_at'])

            self.stdout.write(
                self.style.SUCCESS(
                    f'  -> {attempt.child_email} | Level {quiz.level} | '
                    f'{correct_count}/{answered_count} answered'
                )
            )

        self.stdout.write(self.style.SUCCESS('Quiz attempts seeded.'))

    def _pick_incorrect_option(self, question: Question) -> str:
        for option in question.options:
            if option != question.correct_answer:
                return option
        # Fallback in the unlikely event all options match
        return question.correct_answer

