from django.shortcuts import render,render_to_response
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
import json

# for regular expression
import re

from django import template

# database related
from posts.models import *
from login.models import CustomUser
# from django.contrib.auth.models import User
# from login.models import Profile

# for using OR operation in db query
from django.db.models import Q


# Create your views here.
@login_required
def account_settings(request):
	if request.method == 'POST':
		return HttpResponse("hello it is POST")
	else:
		return render(request, 'account_settings.html', {})

@login_required
def db_account_image(request):
	if request.method == "POST":
		json_data = json.loads(request.body.decode('utf-8'))
		if json_data["request_type"] == "update_profile_image":
			# print "now the user is",request.user
			CustomUser.objects.filter(username=request.user).update(user_image=json_data["image_path"])
			return HttpResponse("haha updated the db")
		elif json_data["request_type"] == "get_profile_image":
			pass
		else:
			raise PermissionDenied
	else:
		raise PermissionDenied
