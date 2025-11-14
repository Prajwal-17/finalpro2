from django.urls import path

from . import views

app_name = 'api'

urlpatterns = [
    path('health/', views.healthcheck, name='health'),
    path('news', views.news_list, name='news-list'),
    path('login', views.login, name='login'),
    path('register', views.register, name='register'),
    path('quiz', views.quiz_list, name='quiz-list'),
    path('quiz/<int:quiz_id>', views.quiz_detail, name='quiz-detail'),
    path('quiz/start', views.quiz_start, name='quiz-start'),
    path('quiz/submit', views.quiz_submit_answer, name='quiz-submit'),
    path('quiz/complete', views.quiz_complete, name='quiz-complete'),
    path('quiz/progress', views.quiz_progress, name='quiz-progress'),
]

