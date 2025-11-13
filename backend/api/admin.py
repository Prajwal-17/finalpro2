from django.contrib import admin

from .models import Article, LoginAttempt, RegistrationRequest


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'published_at')
    search_fields = ('title', 'category', 'summary')
    prepopulated_fields = {'slug': ('title',)}
    list_filter = ('category',)


@admin.register(RegistrationRequest)
class RegistrationRequestAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'email', 'role', 'created_at')
    search_fields = ('full_name', 'email', 'role')
    list_filter = ('role',)
    readonly_fields = ('created_at',)


@admin.register(LoginAttempt)
class LoginAttemptAdmin(admin.ModelAdmin):
    list_display = ('role', 'is_successful', 'created_at')
    search_fields = ('role',)
    list_filter = ('role', 'is_successful')
    readonly_fields = ('created_at',)

# Register your models here.
