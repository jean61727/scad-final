"""
Django settings for musicapp project.

For more information on this file, see
https://docs.djangoproject.com/en/1.7/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/1.7/ref/settings/
"""

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/1.7/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = '1mdsuij_8lcg2qyi@l@y!39q*4gk^$@5kqo67)5ymeh+z8*w_t'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True
# already defined in TEMPLATE
# TEMPLATE_DEBUG = True

ALLOWED_HOSTS = []


# Application definition

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'login',
    'musicSite',
    'posts',
    'account',
    'search',
    'watson',
)

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.auth.middleware.SessionAuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'musicapp.urls'

WSGI_APPLICATION = 'musicapp.wsgi.application'


import dj_database_url
# add these lines at the end of your settings.py to continue to use sql lite locally and only postgres on heroku.
# http://stackoverflow.com/questions/12308046/how-to-launch-your-already-made-django-app-on-heroku

# AUTH_USER_MODEL = 'login.CustomUser'
# import os
if os.getcwd() == "/app":
    DATABASES = {
        'default': dj_database_url.config(default='postgres://localhost')
        # 'default': dj_database_url.config(default='postgres://akkczjfzfijwed:sfihEkKUaM12s1LiwxO7Bj2XuI@ec2-54-83-40-119.compute-1.amazonaws.com:5432/d2s1m01aeba16m')
    }
# Database
# https://docs.djangoproject.com/en/1.7/ref/settings/#databases
else:
    # overwrite database to connect to remote
    DATABASES = {
        'default': dj_database_url.config(default='postgres://akkczjfzfijwed:sfihEkKUaM12s1LiwxO7Bj2XuI@ec2-54-83-40-119.compute-1.amazonaws.com:5432/d2s1m01aeba16m')
    }

# Internationalization
# https://docs.djangoproject.com/en/1.7/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/1.7/howto/static-files/

STATIC_URL = '/static/'
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
STATIC_ROOT = os.path.join(PROJECT_ROOT, 'staticfiles')

# Templates
# TEMPLATE_DIRS = (
#     # Put strings here, like "/home/html/django_templates" or "C:/www/django/templates".
#     # Always use forward slashes, even on Windows.
#     # Don't forget to use absolute paths, not relative paths.
#       os.path.join(os.path.dirname(__file__), 'templates'),
# )

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            # insert your TEMPLATE_DIRS here
            os.path.join(os.path.dirname(__file__), 'templates'),
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                # Insert your TEMPLATE_CONTEXT_PROCESSORS here or use this
                # list if you haven't customized them:
                'django.contrib.auth.context_processors.auth',
                'django.template.context_processors.debug',
                'django.template.context_processors.i18n',
                'django.template.context_processors.media',
                'django.template.context_processors.static',
                'django.template.context_processors.tz',
                'django.contrib.messages.context_processors.messages',
            ],
            'debug': DEBUG,
        },
    },
]


# if a user want to access a method that that requires login and the user is not logged in then it will redirect the user to login page.
import django.contrib.auth
django.contrib.auth.LOGIN_URL = '/'
AUTHENTICATION_BACKENDS = (
    'musicapp.auth_backends.CustomUserModelBackend',
    'django.contrib.auth.backends.ModelBackend',
)
CUSTOM_USER_MODEL = 'login.CustomUser'

