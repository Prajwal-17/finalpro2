import csv
import json
from datetime import date
from pathlib import Path

from django.contrib.auth.hashers import make_password
from django.core.management.base import BaseCommand
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

# Get the project root directory
# This file is at: projectpro/backend/api/management/commands/load_csv_data.py
# We need to go up 5 levels to get to projectpro/
PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent.parent.parent
DATA_DIR = PROJECT_ROOT / 'data'


class Command(BaseCommand):
    help = 'Load data from CSV files into the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--purge',
            action='store_true',
            help='Delete previously seeded data before creating new records.',
        )

    def handle(self, *args, **options):
        purge = options['purge']

        if not DATA_DIR.exists():
            self.stdout.write(
                self.style.ERROR(f'Data directory not found: {DATA_DIR}')
            )
            return

        with transaction.atomic():
            if purge:
                self._purge_seeded_data()

            self.stdout.write('Loading quiz data from JSON...')
            self._load_quiz_data()

            self.stdout.write('Loading users from CSV...')
            self._load_users()

            self.stdout.write('Loading articles from CSV...')
            self._load_articles()

            self.stdout.write('Loading login attempts from CSV...')
            self._load_login_attempts()

            self.stdout.write('Loading quiz attempts from CSV...')
            self._load_quiz_attempts()

        self.stdout.write(self.style.SUCCESS('✅ All data loaded successfully!'))

    def _purge_seeded_data(self):
        self.stdout.write('Purging existing data...')
        QuestionResponse.objects.all().delete()
        QuizAttempt.objects.all().delete()
        LoginAttempt.objects.all().delete()
        RegistrationRequest.objects.all().delete()
        Article.objects.all().delete()
        Question.objects.all().delete()
        Quiz.objects.all().delete()
        self.stdout.write(self.style.WARNING('Previous data removed.'))

    def _load_quiz_data(self):
        quiz_file = DATA_DIR / 'quiz_data.json'
        if not quiz_file.exists():
            self.stdout.write(
                self.style.WARNING(f'Quiz data file not found: {quiz_file}')
            )
            return

        with open(quiz_file, 'r', encoding='utf-8') as f:
            quiz_data = json.load(f)

        for level_data in quiz_data:
            quiz, created = Quiz.objects.get_or_create(
                level=level_data['level'],
                defaults={
                    'title': level_data['title'],
                    'badge_name': level_data['badgeName'],
                }
            )

            if not created:
                quiz.title = level_data['title']
                quiz.badge_name = level_data['badgeName']
                quiz.save()

            # Delete existing questions and recreate them
            Question.objects.filter(quiz=quiz).delete()

            for idx, question_data in enumerate(level_data['questions']):
                Question.objects.create(
                    quiz=quiz,
                    question_text=question_data['q'],
                    options=question_data['options'],
                    correct_answer=question_data['correct'],
                    order=idx,
                )

            self.stdout.write(
                self.style.SUCCESS(
                    f'  -> Loaded {len(level_data["questions"])} questions for {quiz.title}'
                )
            )

    def _load_users(self):
        users_file = DATA_DIR / 'users.csv'
        if not users_file.exists():
            self.stdout.write(
                self.style.WARNING(f'Users file not found: {users_file}')
            )
            return

        with open(users_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            count = 0
            for row in reader:
                metadata = {}
                if row.get('childEmail'):
                    metadata['childEmail'] = row['childEmail']
                if row.get('city'):
                    metadata['city'] = row['city']
                if row.get('preferredLanguage'):
                    metadata['preferredLanguage'] = row['preferredLanguage']
                if row.get('school'):
                    metadata['school'] = row['school']
                if row.get('gradeRange'):
                    metadata['gradeRange'] = row['gradeRange']
                if row.get('organization'):
                    metadata['organization'] = row['organization']
                if row.get('region'):
                    metadata['region'] = row['region']

                RegistrationRequest.objects.update_or_create(
                    email=row['email'],
                    defaults={
                        'role': row['role'],
                        'full_name': row['full_name'],
                        'password_hash': make_password(row['password']),
                        'metadata': metadata,
                    },
                )
                count += 1

            self.stdout.write(
                self.style.SUCCESS(f'  -> Loaded {count} users')
            )

    def _load_articles(self):
        articles_file = DATA_DIR / 'articles.csv'
        if not articles_file.exists():
            self.stdout.write(
                self.style.WARNING(f'Articles file not found: {articles_file}')
            )
            return

        with open(articles_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            count = 0
            for row in reader:
                Article.objects.update_or_create(
                    slug=row['slug'],
                    defaults={
                        'title': row['title'],
                        'summary': row['summary'],
                        'category': row['category'],
                        'published_at': date.fromisoformat(row['published_at']),
                        'source_url': row['source_url'],
                    },
                )
                count += 1

            self.stdout.write(
                self.style.SUCCESS(f'  -> Loaded {count} articles')
            )

    def _load_login_attempts(self):
        login_file = DATA_DIR / 'login_attempts.csv'
        if not login_file.exists():
            self.stdout.write(
                self.style.WARNING(f'Login attempts file not found: {login_file}')
            )
            return

        with open(login_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            LoginAttempt.objects.all().delete()
            attempts = []
            for row in reader:
                payload = {'identifier': row['identifier']}
                metadata = {}
                if row.get('device'):
                    metadata['device'] = row['device']
                if row.get('appVersion'):
                    metadata['appVersion'] = row['appVersion']
                if row.get('ip'):
                    metadata['ip'] = row['ip']
                if metadata:
                    payload['metadata'] = metadata

                attempts.append(
                    LoginAttempt(
                        role=row['role'],
                        is_successful=row['is_successful'].lower() == 'true',
                        payload=payload,
                    )
                )

            LoginAttempt.objects.bulk_create(attempts)
            self.stdout.write(
                self.style.SUCCESS(f'  -> Loaded {len(attempts)} login attempts')
            )

    def _load_quiz_attempts(self):
        attempts_file = DATA_DIR / 'quiz_attempts.csv'
        if not attempts_file.exists():
            self.stdout.write(
                self.style.WARNING(f'Quiz attempts file not found: {attempts_file}')
            )
            return

        with open(attempts_file, 'r', encoding='utf-8') as f:
            reader = csv.DictReader(f)
            QuestionResponse.objects.all().delete()
            QuizAttempt.objects.all().delete()

            for row in reader:
                quiz = Quiz.objects.filter(level=int(row['quiz_level'])).first()
                if not quiz:
                    self.stdout.write(
                        self.style.WARNING(
                            f'  -> Skipping level {row["quiz_level"]}; quiz missing.'
                        )
                    )
                    continue

                total_questions = quiz.questions.count()
                answered_count = min(
                    int(row.get('answered_questions', total_questions)),
                    total_questions
                )
                correct_count = min(
                    int(row.get('correct_answers', 0)),
                    answered_count
                )
                is_completed = row.get('mark_completed', 'false').lower() == 'true'

                attempt = QuizAttempt.objects.create(
                    child_email=row['child_email'],
                    quiz=quiz,
                    total_questions=total_questions,
                    score=0,
                    is_completed=is_completed,
                    completed_at=timezone.now() if is_completed else None,
                )

                questions = list(quiz.questions.order_by('order'))
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

    def _pick_incorrect_option(self, question: Question) -> str:
        for option in question.options:
            if option != question.correct_answer:
                return option
        return question.correct_answer

