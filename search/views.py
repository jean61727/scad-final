from django.shortcuts import render
from django.http import HttpResponse
from django.core.exceptions import PermissionDenied

# Create your views here.
def search_tab_view(request):
	if request.method == "GET":
		return HttpResponse("hello world")
	else:
		return PermissionDenied