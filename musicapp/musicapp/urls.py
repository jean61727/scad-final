from django.conf.urls import patterns, include, url
from django.contrib import admin
from login.views import *
from musicSite.views import *

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'musicapp.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^login/', 'django.contrib.auth.views.login', name='login'),
    url(r'^logout/$', logout_page),
    url(r'^accounts/login/$', 'django.contrib.auth.views.login'), # If user is not login it will redirect to login page
    url(r'^register/$', register),
    url(r'^register/success/$', register_success),
    url(r'^home/$', home_view, name='home'),
    url(r'^app/$', base,name = 'mainpage'),
    url(r'^login_home/$',home_login),
    url(r'^post/$',user_post),



)
