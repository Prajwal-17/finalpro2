from django.urls import path

from . import views

app_name = 'api'

urlpatterns = [
    path('health/', views.healthcheck, name='health'),
    path('news', views.news_list, name='news-list'),
    path('login', views.login, name='login'),
    path('register', views.register, name='register'),
]

