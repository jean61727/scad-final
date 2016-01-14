from django.contrib import admin

from posts.models import *
from login.models import CustomUser

# Register your models here.
class PostViewAdmin(admin.ModelAdmin):
	list_display = ('id','title', 'user_id', 'likes','post_message','category', 'url','start_time','people_listening', 'time')
admin.site.register(Post, PostViewAdmin)

class CommentViewAdmin(admin.ModelAdmin):
	# all
	list_display = ('id','user_id', 'comment_message' , 'post_id','time')
admin.site.register(Comment, CommentViewAdmin)

class UserViewAdmin(admin.ModelAdmin):
	list_display = ('id','username','user_image')
# admin.site.register(CustomUser, UserViewAdmin)

class  FollowerViewAdmin(admin.ModelAdmin):
	"""docstring for  FollowerViewAdmin"""
	list_display = ('id','user_id', 'follow',)
admin.site.register(Follower, FollowerViewAdmin)

class LikeViewAdmin(admin.ModelAdmin):
	"""docstring for LikeViewAdmin"""
	list_display = ('id', 'post_id', 'user_id')
admin.site.register(Like, LikeViewAdmin)