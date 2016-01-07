from django.db import models
from django.contrib.auth.models import User
from datetime import datetime

from watson import search as watson

# Create your models here.
class Post(models.Model):
    #post_id = models.CharField(max_length=50)
    title = models.TextField(max_length=100,null=True)
    url = models.TextField(max_length=100,null=True)
    start_time = models.IntegerField(null=True)
    post_message = models.TextField(max_length=100,null=True)
    # not necessary? this entry should be discussed
    # comments = models.TextField(max_length=100)
    likes = models.IntegerField(null=True)
    people_listening = models.IntegerField(null=True)
    user = models.ForeignKey('login.CustomUser', on_delete=models.CASCADE,null=True)
    user_pic_path = models.CharField(max_length=200, null=True);
    category = models.CharField(max_length=20,null=True)

    time = models.DateTimeField(default=datetime.now)
    def __unicode__(self):
        return self.post_message
watson.register(Post, store=("post_message", "id"))

class Follower(models.Model):
    user = models.ForeignKey('login.CustomUser',on_delete=models.CASCADE,null=True)
    follow =  models.CharField(max_length=50)
    # def __str__(self):
    #     return self.follow

class Comment(models.Model):
    # Django sqlite will automatically generate a unique primary key
    # for each entry in a table, so we don't need comment_id
    # comment_id = models.CharField(max_length=50)
    # commented user id or username? should be discussed
    # comment_user_id = models.CharField(max_length=50)
    post = models.ForeignKey('posts.Post',on_delete=models.CASCADE,null=True)
    comment_message = models.CharField(max_length=300)
    time = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey('login.CustomUser',on_delete=models.CASCADE,null=True)

    # def __str__(self):
    #     return self.comment_message

class Like(models.Model):

    post = models.ForeignKey('posts.Post',on_delete=models.CASCADE,null=True)
    user = models.ForeignKey('login.CustomUser',on_delete=models.CASCADE,null=True)
    
