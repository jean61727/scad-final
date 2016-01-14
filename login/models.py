from django.db import models
from django.contrib.auth.models import User, UserManager
from django.contrib.auth.models import AbstractUser
# from django.contrib.auth.models import User
# Create your models here.

# class MyUser(models.Model):
#    user = models.OneToOneField(User, on_delete=models.CASCADE)
#    user_image = models.TextField(max_length=100)

class CustomUser(User):
	"""docstring for CustomUser"""
	# user = models.ForeignKey(User,db_column='user_id',  on_delete=models.CASCADE,null=True)
	user_image = models.TextField(max_length=100)
	# ok = models.TextField(max_length=100)

	# USERNAME_FIELD = 'username'
    # REQUIRED_FIELDS = []
	objects = UserManager()

