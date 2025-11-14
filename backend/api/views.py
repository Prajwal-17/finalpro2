import json
from http import HTTPStatus

from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods, require_POST

from .models import (
    Article,
    LoginAttempt,
    Question,
    QuestionResponse,
    Quiz,
    QuizAttempt,
    RegistrationRequest,
)

PLACEHOLDER_ARTICLES = [
    {
        'slug': 'pocso-brief',
        'title': 'Understanding the POCSO Act in 2025',
        'summary': 'Updates to state-level guidelines and how Shield 360 aligns with the latest mandates.',
        'category': 'Legal Brief',
        'published_at': '2025-02-01',
        'source_url': '',
    },
    {
        'slug': 'community-playbook',
        'title': 'Community Playbook for Safer Schools',
        'summary': 'Insights from recent workshops with NGOs and school administrators in Bengaluru.',
        'category': 'Community',
        'published_at': '2025-01-18',
        'source_url': '',
    },
    {
        'slug': 'ai-chatbot',
        'title': 'AI-Assisted Crisis Detection: Early Findings',
        'summary': 'How our chatbot pilot is identifying early warning signals and routing help faster.',
        'category': 'Product',
        'published_at': '2025-01-05',
        'source_url': '',
    },
]


@require_GET
def healthcheck(request):
    return JsonResponse({'status': 'ok'})


@require_GET
def news_list(request):
    articles = [
        {
            'id': article.slug,
            'title': article.title,
            'summary': article.summary,
            'category': article.category,
            'publishedAt': article.published_at.isoformat(),
            'sourceUrl': article.source_url,
        }
        for article in Article.objects.all()
    ]

    if not articles:
        articles = [
            {
                'id': item['slug'],
                'title': item['title'],
                'summary': item['summary'],
                'category': item['category'],
                'publishedAt': item['published_at'],
                'sourceUrl': item['source_url'],
            }
            for item in PLACEHOLDER_ARTICLES
        ]

    return JsonResponse(articles, safe=False)


@csrf_exempt
@require_POST
def login(request):
    try:
        payload = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse(
            {'error': 'Invalid JSON payload.'},
            status=HTTPStatus.BAD_REQUEST,
        )

    role = (payload.get('role') or '').strip().lower()
    identifier = (payload.get('identifier') or '').strip()
    password = payload.get('password') or ''

    if not role or not identifier or not password:
        return JsonResponse(
            {
                'error': 'role, identifier, and password are required.',
            },
            status=HTTPStatus.BAD_REQUEST,
        )

    metadata = payload.get('metadata') or {}
    sanitized_payload = {
        'identifier': identifier,
        'metadata': metadata,
    }

    attempt = LoginAttempt.objects.create(
        role=role,
        is_successful=True,
        payload=sanitized_payload,
    )

    return JsonResponse(
        {
            'message': 'Login request received.',
            'attemptId': attempt.id,
            'role': role,
        },
        status=HTTPStatus.OK,
    )


@csrf_exempt
@require_http_methods(['POST'])
def register(request):
    try:
        payload = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse(
            {'error': 'Invalid JSON payload.'},
            status=HTTPStatus.BAD_REQUEST,
        )

    role = (payload.get('role') or 'parent').strip().lower()
    full_name = (payload.get('fullName') or '').strip()
    email = (payload.get('email') or '').strip().lower()
    password = payload.get('password') or ''

    if not full_name or not email or not password:
        return JsonResponse(
            {
                'error': 'fullName, email, and password are required.',
            },
            status=HTTPStatus.BAD_REQUEST,
        )

    metadata = payload.get('metadata') or {}
    allowed_base_keys = {'role', 'fullName', 'email', 'password', 'metadata'}
    for key, value in payload.items():
        if key not in allowed_base_keys:
            metadata[key] = value

    registration = RegistrationRequest.objects.create(
        role=role,
        full_name=full_name,
        email=email,
        password_hash=make_password(password),
        metadata=metadata,
    )

    return JsonResponse(
        {
            'message': 'Registration request received.',
            'requestId': registration.id,
            'role': role,
        },
        status=HTTPStatus.CREATED,
    )


@require_GET
def quiz_list(request):
    """Get all quiz levels"""
    quizzes = Quiz.objects.all()
    quiz_data = []
    for quiz in quizzes:
        quiz_data.append({
            'id': quiz.id,
            'level': quiz.level,
            'title': quiz.title,
            'badgeName': quiz.badge_name,
            'questionCount': quiz.questions.count(),
        })
    return JsonResponse(quiz_data, safe=False)


@require_GET
def quiz_detail(request, quiz_id):
    """Get a specific quiz with all questions"""
    try:
        quiz = Quiz.objects.prefetch_related('questions').get(id=quiz_id)
    except Quiz.DoesNotExist:
        return JsonResponse(
            {'error': 'Quiz not found.'},
            status=HTTPStatus.NOT_FOUND,
        )

    questions = []
    for question in quiz.questions.all():
        questions.append({
            'id': question.id,
            'q': question.question_text,
            'options': question.options,
            'correct': question.correct_answer,
            'order': question.order,
        })

    return JsonResponse({
        'id': quiz.id,
        'level': quiz.level,
        'title': quiz.title,
        'badgeName': quiz.badge_name,
        'questions': questions,
    })


@csrf_exempt
@require_POST
def quiz_start(request):
    """Start a new quiz attempt"""
    try:
        payload = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse(
            {'error': 'Invalid JSON payload.'},
            status=HTTPStatus.BAD_REQUEST,
        )

    child_email = (payload.get('childEmail') or '').strip().lower()
    quiz_id = payload.get('quizId')

    if not child_email or not quiz_id:
        return JsonResponse(
            {'error': 'childEmail and quizId are required.'},
            status=HTTPStatus.BAD_REQUEST,
        )

    try:
        quiz = Quiz.objects.get(id=quiz_id)
    except Quiz.DoesNotExist:
        return JsonResponse(
            {'error': 'Quiz not found.'},
            status=HTTPStatus.NOT_FOUND,
        )

    attempt = QuizAttempt.objects.create(
        child_email=child_email,
        quiz=quiz,
        total_questions=quiz.questions.count(),
    )

    return JsonResponse({
        'attemptId': attempt.id,
        'quizId': quiz.id,
        'totalQuestions': attempt.total_questions,
    }, status=HTTPStatus.CREATED)


@csrf_exempt
@require_POST
def quiz_submit_answer(request):
    """Submit an answer for a question"""
    try:
        payload = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse(
            {'error': 'Invalid JSON payload.'},
            status=HTTPStatus.BAD_REQUEST,
        )

    attempt_id = payload.get('attemptId')
    question_id = payload.get('questionId')
    selected_answer = payload.get('selectedAnswer', '').strip()

    if not attempt_id or not question_id or not selected_answer:
        return JsonResponse(
            {'error': 'attemptId, questionId, and selectedAnswer are required.'},
            status=HTTPStatus.BAD_REQUEST,
        )

    try:
        attempt = QuizAttempt.objects.get(id=attempt_id)
        question = Question.objects.get(id=question_id)
    except (QuizAttempt.DoesNotExist, Question.DoesNotExist):
        return JsonResponse(
            {'error': 'Attempt or question not found.'},
            status=HTTPStatus.NOT_FOUND,
        )

    is_correct = (selected_answer == question.correct_answer)

    # Check if response already exists
    response, created = QuestionResponse.objects.get_or_create(
        attempt=attempt,
        question=question,
        defaults={
            'selected_answer': selected_answer,
            'is_correct': is_correct,
        }
    )

    if not created:
        # Update existing response
        response.selected_answer = selected_answer
        response.is_correct = is_correct
        response.save()

    # Update attempt score
    correct_count = attempt.responses.filter(is_correct=True).count()
    attempt.score = correct_count
    attempt.save()

    return JsonResponse({
        'isCorrect': is_correct,
        'correctAnswer': question.correct_answer,
        'currentScore': attempt.score,
    })


@csrf_exempt
@require_POST
def quiz_complete(request):
    """Mark a quiz attempt as completed"""
    try:
        payload = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse(
            {'error': 'Invalid JSON payload.'},
            status=HTTPStatus.BAD_REQUEST,
        )

    attempt_id = payload.get('attemptId')
    if not attempt_id:
        return JsonResponse(
            {'error': 'attemptId is required.'},
            status=HTTPStatus.BAD_REQUEST,
        )

    try:
        attempt = QuizAttempt.objects.get(id=attempt_id)
    except QuizAttempt.DoesNotExist:
        return JsonResponse(
            {'error': 'Attempt not found.'},
            status=HTTPStatus.NOT_FOUND,
        )

    from django.utils import timezone
    attempt.is_completed = True
    attempt.completed_at = timezone.now()
    attempt.save()

    return JsonResponse({
        'attemptId': attempt.id,
        'score': attempt.score,
        'totalQuestions': attempt.total_questions,
        'percentage': round((attempt.score / attempt.total_questions) * 100) if attempt.total_questions > 0 else 0,
    })


@require_GET
def quiz_progress(request):
    """Get quiz progress for a user"""
    role = request.GET.get('role', '').strip().lower()
    identifier = request.GET.get('identifier', '').strip().lower()

    if not role or not identifier:
        return JsonResponse(
            {'error': 'role and identifier are required.'},
            status=HTTPStatus.BAD_REQUEST,
        )

    if role == 'child':
        # Get child's own progress
        attempts = QuizAttempt.objects.filter(child_email=identifier).order_by('-started_at')
        progress_data = []
        for attempt in attempts:
            progress_data.append({
                'attemptId': attempt.id,
                'quizId': attempt.quiz.id,
                'quizTitle': attempt.quiz.title,
                'level': attempt.quiz.level,
                'badgeName': attempt.quiz.badge_name,
                'score': attempt.score,
                'totalQuestions': attempt.total_questions,
                'percentage': round((attempt.score / attempt.total_questions) * 100) if attempt.total_questions > 0 else 0,
                'isCompleted': attempt.is_completed,
                'startedAt': attempt.started_at.isoformat(),
                'completedAt': attempt.completed_at.isoformat() if attempt.completed_at else None,
            })
        return JsonResponse(progress_data, safe=False)

    elif role == 'parent':
        # Get child's progress (parent needs to provide child email in metadata)
        # For now, we'll use identifier as child email
        # In production, you'd link parent to child via RegistrationRequest metadata
        attempts = QuizAttempt.objects.filter(child_email=identifier).order_by('-started_at')
        progress_data = []
        for attempt in attempts:
            progress_data.append({
                'childEmail': attempt.child_email,
                'quizTitle': attempt.quiz.title,
                'level': attempt.quiz.level,
                'badgeName': attempt.quiz.badge_name,
                'score': attempt.score,
                'totalQuestions': attempt.total_questions,
                'percentage': round((attempt.score / attempt.total_questions) * 100) if attempt.total_questions > 0 else 0,
                'isCompleted': attempt.is_completed,
                'startedAt': attempt.started_at.isoformat(),
                'completedAt': attempt.completed_at.isoformat() if attempt.completed_at else None,
            })
        return JsonResponse(progress_data, safe=False)

    elif role == 'teacher':
        # Get all children's progress
        attempts = QuizAttempt.objects.all().order_by('-started_at')
        progress_data = []
        for attempt in attempts:
            progress_data.append({
                'childEmail': attempt.child_email,
                'quizTitle': attempt.quiz.title,
                'level': attempt.quiz.level,
                'badgeName': attempt.quiz.badge_name,
                'score': attempt.score,
                'totalQuestions': attempt.total_questions,
                'percentage': round((attempt.score / attempt.total_questions) * 100) if attempt.total_questions > 0 else 0,
                'isCompleted': attempt.is_completed,
                'startedAt': attempt.started_at.isoformat(),
                'completedAt': attempt.completed_at.isoformat() if attempt.completed_at else None,
            })
        return JsonResponse(progress_data, safe=False)

    return JsonResponse(
        {'error': 'Invalid role.'},
        status=HTTPStatus.BAD_REQUEST,
    )

