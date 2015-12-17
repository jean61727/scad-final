from django.shortcuts import render,render_to_response
from django.http import HttpResponse,Http404
from django.template.loader import get_template
from django import template
from django.template import Context

from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponseRedirect
from django.template import RequestContext
from posts.models import Post
from login.models import CustomUser


# Create your views here.

def home_view(request):
	if request.method == "POST":
		# ajax call
		return HttpResponse("haha");
	else:
		# a access request to website visit
		return render(request, 'playground_main.html', {})
	# return render_to_response('playground_main.html')

def base(request):
	
	return render(request,'playground_main.html')

def link(request):

	return render(request,'post_link.html')

@csrf_protect
def user_post(request):

	#request.POST['name_of_var']
	#print 'haha'
	#print request.POST['input_link']
	context=RequestContext(request)
	if request.method == 'POST':
		#request.POST
		user = CustomUser.objects.get(id=request.POST.get('user'))
		new_post = Post(
			user_id=user,
            url=request.POST.get('vidsID'),
            start_time=request.POST.get('input_start'),
            post_message=request.POST.get('post_message'),
            )
		new_post.save()
		return HttpResponseRedirect('/app')
	else:
		return render(request, 'playground_main.html', {})



