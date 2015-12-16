from django.db import models
from django.contrib.auth.models import User
# Create your models here.
class Post(models.Model):
    title = models.TextField(max_length=100)
    url = models.TextField(max_length=100)
    start_time = models.IntegerField()
    post_message = models.TextField(max_length=100)
    comments = models.TextField(max_length=100)
    likes = models.IntegerField()
    people_listening = models.IntegerField()
    user_id = models.ForeignKey('login.MyUser', on_delete=models.CASCADE)
    category = models.CharField(max_length=20)
 
class Follower(models.Model):
	user_id = models.ForeignKey('login.MyUser',on_delete=models.CASCADE)
	follow =  models.CharField(max_length=50)