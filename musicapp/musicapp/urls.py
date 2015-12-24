from django.conf.urls import patterns, include, url
from django.contrib import admin
from login.views import *
from musicSite.views import *

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'musicapp.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    # Main View Tab Content
    url(r'^$', home_view, name='home'),
    url(r'^home/$', home_view, name='home'),
    url(r'^explore/songcategories/content/(?P<category>\w+)/', categoriesContent),
    url(r'^explore/songcategories/$',exploreSongCategories),
    url(r'^profile/$',profile),
    url(r'^profile/(?P<user>\w+)',profile_user,name="profile_url"),
    url(r'^search/$',search),


    # Backend Administration
    url(r'^admin/', include(admin.site.urls)),

    url(r'^login/', 'django.contrib.auth.views.login', name='login'),
    url(r'^logout/$', logout_page),
    url(r'^accounts/login/$', 'django.contrib.auth.views.login'), # If user is not login it will redirect to login page
    url(r'^register/$', register),
    url(r'^register/success/$', register_success),
    url(r'^app/$', base,name = 'mainpage'),
    url(r'^login_home/$',home_login),
    url(r'^post/$',user_post),
    url(r'^like/$',like_add),
    url(r'^follow/$',follow_add),
    url(r'^unfollow/$',follow_delete),
    


)
