from django.contrib import admin

from posts.models import Post,Follower,Comments
# Register your models here.

admin.site.register(Post)
admin.site.register(Follower)
admin.site.register(Comments)