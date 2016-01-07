from django.db import models
from django.contrib.auth.models import User, UserManager
# Create your models here.

#class MyUser(models.Model):
#    user = models.OneToOneField(User, on_delete=models.CASCADE)
#    user_image = models.TextField(max_length=100)


class CustomUser(User):
	user_image = models.TextField(max_length=100)
	objects = UserManager()
