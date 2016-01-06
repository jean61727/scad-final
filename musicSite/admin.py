from django.contrib import admin

from posts.models import *
# Register your models here.
class PostViewAdmin(admin.ModelAdmin):
	list_display = ('post_message', 'user_id_id', 'time')

class CommentViewAdmin(admin.ModelAdmin):
	list_display = ('comment_message', 'user_id', 'post_id','time')


admin.site.register(Post, PostViewAdmin)
admin.site.register(Comment, CommentViewAdmin)

admin.site.register(Follower)
admin.site.register(Like)