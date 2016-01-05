from django.shortcuts import render,render_to_response
from django.http import HttpResponse
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
import json

# for regular expression
import re

from django import template

# database related
from posts.models import *
from login.models import CustomUser
# for using OR operation in db query
from django.db.models import Q


# Create your views here.
def account_settings(request):
	if request.method == 'POST':
		return HttpResponse("hello it is POST")
	else:
		return HttpResponse("heelo it is getTTT")