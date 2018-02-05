# musicapp/musicapp/production_settings.py

# Import all default settings.
from .settings import *

import dj_database_url
DATABASES = {
    'default': dj_database_url.config()
}

import os
# Static asset configuration.
# STATIC_ROOT = 'staticfiles'
PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
STATIC_ROOT = os.path.join(PROJECT_ROOT, 'staticfiles')

# Honor the 'X-Forwarded-Proto' header for request.is_secure().
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Allow all host headers.
ALLOWED_HOSTS = ['*']

# Turn off DEBUG mode.
DEBUG = False