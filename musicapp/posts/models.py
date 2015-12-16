from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Post(models.Model):
    post_id = models.CharField(max_length=50)
    title = models.TextField(max_length=100)
    url = models.TextField(max_length=100)
    start_time = models.IntegerField()
    post_message = models.TextField(max_length=100)
    # not necessary? this entry should be discussed
    # comments = models.TextField(max_length=100)
    likes = models.IntegerField()
    people_listening = models.IntegerField()
    user_id = models.ForeignKey('login.CustomUser', on_delete=models.CASCADE)
    category = models.CharField(max_length=20)

    time = models.DateTimeField(auto_now_add=True)
 
class Follower(models.Model):
	user_id = models.ForeignKey('login.CustomUser',on_delete=models.CASCADE)
	follow =  models.CharField(max_length=50)

class Comments(models.Model):
    comment_id = models.CharField(max_length=50)
    # commented user id or username? should be discussed
    # comment_user_id = models.CharField(max_length=50)
    comment_message = models.CharField(max_length=300)
    time = models.DateTimeField(auto_now_add=True)
