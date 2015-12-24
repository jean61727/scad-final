from django.shortcuts import render,render_to_response
from django.http import HttpResponse,Http404
from django.http import JsonResponse
from django.template.loader import get_template
from django import template
from django.template import Context

from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponseRedirect
from django.template import RequestContext
from posts.models import Post,Comments,Follower
from login.models import CustomUser
import json
from django.core import serializers

# Create your views here.

def home_view(request):
	if request.method == "POST":
		# ajax call
		json_data = json.loads(request.body)
		request_type = json_data['request_type']
		if request_type == "get_home_tab_post":
			# query database data
			display_post_count = 2
			filtered_posts = Post.objects.all().order_by('-time').values(
				'id',
				'title',
				'url',
				'start_time',
				'post_message',
				'likes',
				'people_listening',
				'category',
				'user_id_id',
				'time',
				'user_pic_path')[:display_post_count]

			# print list(Post.objects.latest('time'))
			# organize a json object
			json_object = {
				"posts":[]
			}
			for one_post in filtered_posts:
				# make a data set for a single post
				post_data = {
					"post_id":one_post["id"],
					"is_like":"false",
					"like_count":one_post["likes"],
					"video_id":one_post["url"],
					"video_title": one_post["title"] ,
					"user_pic":  one_post["user_pic_path"] ,
					"username": one_post["user_id_id"]  ,
					"message": one_post["post_message"]  ,
					"comments":[]
				}
				# collecting comment data
				filtered_comments = Comments.objects.filter(post_id=one_post["id"]).values("comment_message")
				comments = []
				
				for one_comment in filtered_comments:
					comment_data = {
						"commentor":"me",
						"comment_content":one_comment["comment_message"],
					}
					comments.append(comment_data)

				post_data["comments"] = comments

				json_object["posts"].append(post_data)

			return JsonResponse(json_object)

		elif request_type == "push_comment_input":
			Comments.objects.create(
				comment_message=json_data["comment_message"],
				post_id=json_data["post_id"],
				)
			comment_data = {
				"commentor":"meee",
				"comment_content":json_data["comment_message"],
			}
			return JsonResponse(comment_data)

		else:
			return HttpResponse("Invalid request type")
	else:
		# a access request to website visit
		return render(request, 'playground_main.html', {})
	# return render_to_response('playground_main.html')

def base(request):
	
	return render(request,'playground_main.html')

def link(request):

	return render(request,'post_link.html')

def exploreSongCategories(request):

	return render(request,'exploreSongCategories.html')

def categoriesContent(request,category):

	post_list = Post.objects.filter(category=category)

	return render(request,'exploreSongCategoriesContent.html', {'post_list': post_list})

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
            category=request.POST.get('category'),
            )
		print (request.POST.get('category'))
		print ("hello")
		new_post.save()
		return HttpResponseRedirect('/app')
	else:
		return render(request, 'playground_main.html', {})

def profile (request):

	user_post=Post.objects.filter(user_id=request.user)
	video_id_list=[]
	for post in user_post:
		video_id_list.append(str(post.url))
	video_id_list=json.dumps(video_id_list)

	data = serializers.serialize("json", user_post)

	#print user_post[1].url
	#print user_post.post_message[1]
	#print request.user
	return render(request,'profile.html',{'user_post': user_post,'data':data})

def profile_user (request,user):

	user = CustomUser.objects.get(username=user)
	user_post=Post.objects.filter(user_id=user)
	print user
	video_id_list=[]
	for post in user_post:
		video_id_list.append(str(post.url))
		print str(post.url)
	video_id_list=json.dumps(video_id_list)

	data = serializers.serialize("json", user_post)

	#print user_post[1].url
	#print user_post.post_message[1]
	#print request.user
	return render(request,'search.html',{'user_post': user_post,'data':data,'user_other':user})



def search(request):
	user_list=CustomUser.objects.all()
	print user_list
	return render(request,'search.html',{'user_list':user_list})


def like_add(request):


	return

def follow_add(request):

	context=RequestContext(request)
	if request.method == 'POST':
		#request.POST
		print request.user
		user = CustomUser.objects.get(username=request.user)
		new_post = Follower(
			user_id=user,
            follow=request.POST.get('follow')
            )
		print (request.POST.get('follow'))
		print ("hello")
		new_post.save()
		return HttpResponseRedirect('/profile/'+request.POST.get('follow'))
	else:
		return render(request, 'playground_main.html', {})

def follow_delete(request):

	context=RequestContext(request)
	if request.method == 'POST':
		#request.POST
		print request.user
		user = CustomUser.objects.get(username=request.user)
		Follower.objects.filter(user_id=user , follow=request.POST.get('follow')).delete()
		
		return HttpResponseRedirect('/profile/'+request.POST.get('follow'))
	else:
		return render(request, 'playground_main.html', {})


