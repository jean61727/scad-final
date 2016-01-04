from django.shortcuts import render,render_to_response
from django.http import HttpResponse,Http404
from django.core.exceptions import PermissionDenied
from django.http import JsonResponse
import json

from django.template.loader import get_template
from django import template
from django.template import Context

from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponseRedirect
from django.template import RequestContext

from posts.models import *
from login.models import CustomUser

from django.core import serializers

# for using OR operation in db query
from django.db.models import Q

# Create your views here.
def post_db(request):
	if request.method == "POST":
		# ajax call
		json_data = json.loads(request.body.decode('utf-8'))
		request_type = json_data['request_type']
		if request_type == "get_post":
			# we don't know how to join tables, so we first get user id
			# resolve the username into user id
			filter_data = json_data["filter"]
			if "username" in filter_data:
				if type(filter_data["username"]) is list:
					id_list = []
					for a_name in filter_data["username"]:
						id_list.append(CustomUser.objects.filter(username=a_name).values("id"))
					del filter_data["username"]
					filter_data.update({
						"user_id_id":id_list
					})
				else:
					user_id = CustomUser.objects.filter(username=filter_data["username"]).values("id")
					del filter_data["username"]
					filter_data.update({
						"user_id_id":user_id
					})


			# parse the filter dict object
			filter = {}
			q_object = Q()
			sort_option = "-time"
			for key in filter_data:
				# because we don't know how to use the god damn join table, so we still have to deal with user id explicitly
				if key == 'user_id_id':
					# if we have multiple ids then iterate it
					# finally, add them to the Q object
					if type(filter_data[key]) is list:
						for a_id in filter_data[key]:
							q_object = q_object|Q(**{key:a_id})
					else:
						filter.update( { key: filter_data[key] } )
				elif key == 'or':
					# for adding OR operation for the db query
					for field in filter_data[key]:
						if type(filter_data[key][field]) is list:
							for a_constrain in filter_data[key][field]:
								q_object = q_object|Q(**{field:a_constrain})
						else:
							q_object = q_object|Q(**{field:filter_data[key][field]})
				elif key == 'sort_by':
					# we also implement sort function for post API
					sort_option = filter_data[key]
				else:
					filter.update({ key:filter_data[key] })

			# some must-have field
			if "limit" in filter:
				display_post_count = filter["limit"]
				del filter["limit"]
			else:
				display_post_count = 1
			
			# query all info of a post from database
			filtered_db_data = Post.objects.filter(q_object&Q(**filter))

			filtered_posts = filtered_db_data.order_by(sort_option).values(
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

			# start organizing a json object
			json_object = {
				"posts":[]
			}
			for one_post in filtered_posts:

				# make a data set for a single post
				user_data = CustomUser.objects.filter(id=one_post["user_id_id"]).values("username")[0]
				post_data = {
					"post_id":one_post["id"],
					"is_like":"false",
					"like_count":one_post["likes"],
					"video_id":one_post["url"],
					"video_title": one_post["title"] ,
					"user_pic":  one_post["user_pic_path"] ,
					"username": user_data["username"],
					"user_id": one_post["user_id_id"]  ,
					"message": one_post["post_message"]  ,
					"comments":[]
				}
				# collecting comment data
				comment_query_constrain = {"post_id":one_post["id"]}
				filtered_comments = Comments.objects.filter(**comment_query_constrain).values("comment_message")
				comments = []
				
				for one_comment in filtered_comments:
					comment_data = {
						"commentor":"me",
						"comment_content":one_comment["comment_message"],
					}
					comments.append(comment_data)

				# append to json object
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

		elif request_type == "get_follower_list":
			requested_user = json_data["main_user_name"]
			# convert username into user id
			requested_user_id = CustomUser.objects.filter(username=requested_user).values("id")
			follower_name_list = Follower.objects.filter(user_id_id=requested_user_id).values("follow")
			json_object = {
				"follower_list":[],
				"login_user_name":str(request.user),
			}
			for follower_data in follower_name_list:
				json_object["follower_list"].append(follower_data["follow"])
			return JsonResponse(json_object)

		elif request_type == "get_login_user":
			json_object = {
				"username":str(request.user),
			}
			return JsonResponse(json_object)
		else:
			return HttpResponse("view.py: Invalid request type")
	else:
		raise PermissionDenied

def home_view(request):
	if request.method == "POST":
		raise PermissionDenied
	else:
		# a access request to website visit
		# print "username ",request.user
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

	return render(request,'exploreSongCategoriesContent.html', {'post_list': post_list,'category':category})

def exploreUsers(request):

	all_users = CustomUser.objects.all()
	all_posts = Post.objects.all()

	user_posts = {}

	# for user in all_users:
	# 	user_posts.update({'user.id': Post.objects.filter(user_id=user.username)})
	# 	#user_posts[user.id] = Post.objects.filter(user_id=user.username)
	# 	print (Post.objects.filter(user_id=user.username))
	# 	print(user.id)
		
	return render(request,'exploreUsers.html',{'all_users': all_users,'all_posts': all_posts})

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
			title=request.POST.get('vidsTitle'),
            )
		print (request.POST.get('category'))
		print ("hello")
		new_post.save()
		return HttpResponseRedirect('/home')
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
	print (user)
	video_id_list=[]
	for post in user_post:
		video_id_list.append(str(post.url))
		print (str(post.url))
	video_id_list=json.dumps(video_id_list)

	data = serializers.serialize("json", user_post)

	#print user_post[1].url
	#print user_post.post_message[1]
	#print request.user
	return render(request,'search.html',{'user_post': user_post,'data':data,'user_other':user})



def search(request):
	user_list=CustomUser.objects.all()
	print (user_list)
	return render(request,'search.html',{'user_list':user_list})



def follow_add(request):

	context=RequestContext(request)
	if request.method == 'POST':
		#request.POST
		print (request.user)
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
		print (request.user)
		user = CustomUser.objects.get(username=request.user)
		Follower.objects.filter(user_id=user , follow=request.POST.get('follow')).delete()
		
		return HttpResponseRedirect('/profile/'+request.POST.get('follow'))
	else:
		return render(request, 'playground_main.html', {})

def like_add(request):

	context=RequestContext(request)
	if request.method == 'POST':
		#request.POST
		print (request.user)
		user = CustomUser.objects.get(username=request.user)
		new_post = Likes(
			user_id=user,
            post_id=request.POST.get('post_id')
            )
		print (request.POST.get('post_id'))
		print ("hello")
		new_post.save()
		return render(request, 'playground_main.html', {})
	else:
		return render(request, 'playground_main.html', {})
def like_delete(request):

	context=RequestContext(request)
	if request.method == 'POST':
		#request.POST
		print (request.user)
		user = CustomUser.objects.get(username=request.user)
		Likes.objects.filter(user_id=user , post_id=request.POST.get('post_id')).delete()
		
		return render(request, 'playground_main.html', {})
	else:
		return render(request, 'playground_main.html', {})
