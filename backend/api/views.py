import json
from http import HTTPStatus

from django.contrib.auth.hashers import make_password
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET, require_http_methods, require_POST

from .models import Article, LoginAttempt, RegistrationRequest

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

