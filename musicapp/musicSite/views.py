from django.shortcuts import render,render_to_response
from django.http import HttpResponse,Http404
from django.template.loader import get_template
from django import template
from django.template import Context
# Create your views here.
def base(request):
	
	return render_to_response('test.html')