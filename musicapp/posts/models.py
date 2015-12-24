from django.db import models
from django.contrib.auth.models import User
from datetime import datetime 
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
    user_id = models.ForeignKey('login.CustomUser', on_delete=models.CASCADE,null=True)
    user_pic_path = models.CharField(max_length=200, null=True);
    category = models.CharField(max_length=20,null=True)

    time = models.DateTimeField(default=datetime.now)
 
class Follower(models.Model):
	user_id = models.ForeignKey('login.CustomUser',on_delete=models.CASCADE)
	follow =  models.CharField(max_length=50)

class Comments(models.Model):
    # Django sqlite will automatically generate a unique primary key
    # for each entry in a table, so we don't need comment_id
    # comment_id = models.CharField(max_length=50)
    # commented user id or username? should be discussed
    # comment_user_id = models.CharField(max_length=50)
    post_id = models.CharField(max_length=100, null=True)
    comment_message = models.CharField(max_length=300)
    time = models.DateTimeField(auto_now_add=True)
