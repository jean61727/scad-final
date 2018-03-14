# Response to client
from django.shortcuts import render,render_to_response
from django.http import HttpResponse,Http404
from django.http import JsonResponse

from django.views.decorators.csrf import csrf_protect
from django.views.decorators.csrf import ensure_csrf_cookie
from django.http import HttpResponseRedirect
from django.template import RequestContext

# Signals toward client side
from django.core.exceptions import PermissionDenied
from django.contrib.auth.decorators import login_required

#rec
from sklearn.metrics.pairwise import cosine_similarity

# Processing data
import json
from django.core import serializers
import re

# Database model importing
from posts.models import *
from login.models import CustomUser
# for using OR operation in db query
from django.db.models import Q
# used for increment a table field value
from django.db.models import F
# exceptions for queryset get() function
from django.core.exceptions import ObjectDoesNotExist

# Template View importing
from django.template.loader import get_template
from django import template
from django.template import Context

# Create your views here.
def post_db(request):
	if request.method == "POST":
		# ajax call
		json_data = json.loads(request.body.decode('utf-8'))
		request_type = json_data['request_type']
		if request_type == "get_post":
			# print ("we are geting posttttt!!!")
			# resolve the username into user id
			# we don't know how to join tables, so we first get user id
			filter_data = json_data["filter"]
			if "username" in filter_data:
				if type(filter_data["username"]) is list:
					id_list = []
					for a_name in filter_data["username"]:
						id_list.append(CustomUser.objects.filter(username=a_name).values("id"))
					del filter_data["username"]
					filter_data.update({
						"user_id":id_list
					})
				else:
					user_id = CustomUser.objects.filter(username=filter_data["username"]).values("id")
					del filter_data["username"]
					filter_data.update({
						"user_id":user_id
					})

			# parse the filter dict object
			filter = {}
			# q object is specially for OR operation
			q_object = Q()
			q_is_like_post = Q()
			sort_option = "-time"
			for key in filter_data:
				# because we don't know how to use the god damn join table, so we still have to deal with user id explicitly
				if key == 'user_id':
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
				elif key == 'is_like':
					# we take "strict" approach here. is_like will be AND with other conditions
					if filter_data[key]["value"] == "true":
						liked_result = Like.objects.filter(user_id__username=filter_data[key]["username"]).values_list("post_id", flat=True)
						for liked_post_id in liked_result:
							q_is_like_post = q_is_like_post|Q(id=liked_post_id)
						pass
					else:
						# print ("is false!!!!!!!!!")
						pass
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
			filtered_db_data = Post.objects.filter(q_object&Q(**filter)&q_is_like_post)
			# filtered_db_data = Post.objects.filter(user_id=2)

			# print ("!!!!!!!!!is ", filtered_db_data)
			# order the result and access it
			filtered_posts = filtered_db_data.order_by(sort_option).values(
				'id',
				'title',
				'url',
				'start_time',
				'post_message',
				'likes',
				'people_listening',
				'category',
				'user_id',
				'time',
				'user_pic_path' # this field is deprecated
				)[:display_post_count]

			# print ("!!!!!!! is ", filtered_posts)
			# start organizing a json object
			json_object = {
				"posts":[]
			}
			for one_post in filtered_posts:

				# collecting post user profile info
				# print ("one is!!!!!!!! ", one_post["user_id"])
				user_data = CustomUser.objects.filter(id=one_post["user_id"]).values("username","user_image")
				# print ("the user is !!!!!!!!!", user_data)
				if len(user_data) == 0:
					return HttpResponse("Cannot retrieve post. No such post id.")
				else:
					user_data = user_data[0]

				# check if the user likes the post
				is_like = Like.objects.filter(user_id=request.user,post_id=one_post["id"]).exists()

				# make a data set for a single post
				post_data = {
					"post_id":one_post["id"],
					"is_like":is_like,
					"like_count":one_post["likes"],
					"video_id":one_post["url"],
					"video_title": one_post["title"] ,
					"start_time":one_post["start_time"],
					"user_pic": user_data["user_image"] ,
					"username": user_data["username"],
					"user_id": one_post["user_id"]  ,
					"message": one_post["post_message"]  ,
					"comments":[],
				}
				# collecting comment data
				comment_query_constrain = {"post_id":one_post["id"]}
				filtered_comments = Comment.objects.filter(**comment_query_constrain).values("comment_message", "user_id", "time")
				comments = []
				
				for one_comment in filtered_comments:
					# collecting commentor data
					commentor_data = CustomUser.objects.filter(id=one_comment["user_id"]).values("username", "user_image")

					# pack up comment data
					if len(commentor_data) != 0:
						commentor_data = commentor_data[0]
						comment_data = {
							"commentor":commentor_data["username"],
							"comment_content":one_comment["comment_message"],
							"commentor_image":commentor_data["user_image"],
							"comment_time": one_comment["time"].strftime('%-B %-d %p %-I:%M %Y'),
						}
						comments.append(comment_data)
					else:
						return HttpResponse("Comment exist but getting commentor data failed")
				# append to json object
				post_data["comments"] = comments

				json_object["posts"].append(post_data)

			return JsonResponse(json_object)

		elif request_type == "push_comment_input":
			# check comment is blank or not first
			if re.match('^\s*$',json_data["comment_message"]) is not None:
				# print "garbage comment"
				comment_data = {
					"comment_content":"",
				}
			else:
				# print "good comment"
				# the commentor is the one currently logged in
				Comment.objects.create(
					comment_message=json_data["comment_message"],
					post_id=json_data["post_id"],
					user_id=request.user.id,
					)
				commentor_image = CustomUser.objects.filter(id=request.user.id).values("user_image")[0]
				if commentor_image is not None:
					comment_data = {
						"commentor":str(request.user),
						"comment_content":json_data["comment_message"],
						"commentor_image":commentor_image["user_image"],
					}
				else:
					return HttpResponse("While pushing comment, unable to reach commentor's data")

			return JsonResponse(comment_data)

		elif request_type == "get_follower_list":
			requested_user = json_data["main_user_name"]
			# print "the username requesting is ",requested_user
			# convert username into user id
			requested_user_id = CustomUser.objects.filter(username=requested_user).values("id")
			# print "the user id is ",requested_user_id
			follower_name_list = Follower.objects.filter(user_id=requested_user_id).values("follow")
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
		
		elif request_type == "uprate_like":
			like_count = Post.objects.get(id=json_data["post_id"],)
			# caes that no such post, is not handled
			if like_count.likes == None:
				Post.objects.filter(id=json_data["post_id"],).update(likes=1)
				return HttpResponse("Likes count is None. We have initialize it to 0 and increment 1")
			else:
				liked_post = Post.objects.get(id=json_data["post_id"],)
				like_count = liked_post.likes
				liked_post.likes = F('likes') + 1
				liked_post.save()
				# Post.objects.filter(id=json_data["post_id"],user_id=request.user).update(likes=F('likes') + 1)
				json_response = {
					"state":"ok",
					"like_count":like_count + 1,
				}
				return JsonResponse(json_response)
		elif request_type == "downrate_like":
			like_count = Post.objects.get(id=json_data["post_id"],)
			if like_count.likes == None:
				Post.objects.filter(id=json_data["post_id"],).update(likes=0)
				return HttpResponse("Likes count is None. We have initialize it to 0")
			else:
				liked_post = Post.objects.get(id=json_data["post_id"],)
				like_count = liked_post.likes
				liked_post.likes = F('likes') - 1
				liked_post.save()
				# Post.objects.filter(id=json_data["post_id"],user_id=request.user).update(likes=F('likes') + 1)
				json_response = {
					"state":"ok",
					"like_count":like_count - 1,
				}
				return JsonResponse(json_response)
		
		elif request_type == "delete_post":
			# user = CustomUser.objects.get(username=request.user)
			Post.objects.filter(user_id=request.user , id=json_data["post_id"]).delete()
			json_response = {
				"state":"ok",
			}
			return JsonResponse(json_response)
		
		else:
			return HttpResponse("view.py: Invalid request type")
	else:
		raise PermissionDenied

@login_required
def home_view(request):

	all_users = CustomUser.objects.all()
	all_posts = Post.objects.all()
	follower = Follower.objects.filter(user_id=request.user)
	five_posts=Post.objects.all()[:5]

	warning = "Hey newbie, follow some users first so your home page will be filled with posts!"

	if len(follower) == 0:
		return render(request,'exploreUsers.html',{'all_users': all_users,'all_posts': five_posts, 'tab':'explore', 'user_self': request.user,'follower':follower,'warning':warning})

	elif request.method == "POST":
		raise PermissionDenied
	else:
		# a website visit

		# check

		return render(request, 'playground_main.html', {'tab':'home'})

def base(request):
	
	return render(request,'playground_main.html')

def link(request):

	return render(request,'post_link.html')

def exploreSongCategories(request):

	return render(request,'exploreSongCategories.html', {'tab':'explore'})

def categoriesContent(request,category):

	post_list = Post.objects.filter(category=category)

	return render(request,'exploreSongCategoriesContent.html', {'post_list': post_list,'category':category, 'tab':'explore'})

def exploreUsers(request):

	all_users = CustomUser.objects.all()
	all_posts = Post.objects.all()[:5]
	follower = Follower.objects.filter(user_id=request.user)

	rec_users=user_user(request)
	for following in follower:
		for users in rec_users:
			if(following.follow==users.username):
				rec_users.remove(users)
	# print (rec_users[0])
	# print (all_users)
	# return render(request,'exploreUsers.html',{'all_users': all_users,'all_posts': all_posts, 'tab':'explore', 'user_self': request.user,'follower':follower})
	return render(request,'exploreUsers.html',{'all_users': rec_users,'all_posts': all_posts, 'tab':'explore', 'user_self': request.user,'follower':follower})

def welcome(request):
	return render(request,'welcome.html')

@csrf_protect
def user_post(request):

	#request.POST['name_of_var']
	#print 'haha'
	#print request.POST['input_link']
	context=RequestContext(request)
	if request.method == 'POST':

		# handle start time form field
		if request.POST.get('input_start'):
			start_time = request.POST.get('input_start')
		else:
			start_time = 0
		# prepare user profile image
		try:
			user_pic_path = CustomUser.objects.get(id=request.user.id).user_image
		except:
			raise Http404("We try to reach user's profile info when storing the new post, but such user either is not registered yet, or we have multiple instance of his/her")

		new_post = Post(
			user_id=request.POST.get('user'),
			url=request.POST.get('vidsID'),
			start_time=start_time,
			post_message=request.POST.get('post_message'),
			category=request.POST.get('category'),
			title=request.POST.get('vidsTitle'),
			likes=0,
			people_listening=0, # TODO
			user_pic_path=user_pic_path,
            )
		# print (request.POST.get('category'))
		# print ("hello")
		new_post.save()
		return HttpResponseRedirect('/home')
	else:
		return render(request, 'playground_main.html', {'tab':'home'})

@csrf_protect
def profile (request,user,control):
	print (user)
	print (control)
	print (int(control)==2)
	like_post=Like.objects.filter(user_id=request.user)
	user_post=Post.objects.filter(user_id=request.user)
	user_follow=Follower.objects.filter(user_id=request.user)

	user_be_followed = CustomUser.objects.get(username=user)
	be_followed_post=Post.objects.filter(user_id=user_be_followed)

	like_post_list=[]
	for post in like_post:
		like_post_list.append(Post.objects.filter(id=post.post_id)[0])
	
	following_user_list=[]
	for following in user_follow:
		following_user_list.append(CustomUser.objects.filter(username=following.follow)[0])
	
	
	data = serializers.serialize("json", user_post)
	like_data=serializers.serialize("json", like_post_list)
	be_followed_data = serializers.serialize("json", be_followed_post)
	
	if(str(request.user) !=str(user)):
		if(int(control)==2):
			return render(request,'explore_user_profile.html',{'data':be_followed_data, 'tab':'profile','follow_user':user_be_followed})
		# followed profile
		elif int(control) == 1:
			return render(request,'profile_other.html',{'data':be_followed_data, 'tab':'profile','follow_user':user_be_followed})
	# self profile
	return render(request,'profile.html',{'like_data': like_data,'data':data, 'tab':'profile','user_follow':following_user_list})

'''def profile_user (request,user):

	user = CustomUser.objects.get(username=user)
	user_post=Post.objects.filter(user_id=user)
	print (user)


	data = serializers.serialize("json", user_post)

	#print user_post[1].url
	#print user_post.post_message[1]
	#print request.user
	return render(request,'search.html',{'user_post': user_post,'data':data,'user_other':user, 'tab':'search'})

<<<<<<< HEAD
'''
def search(request):
	user_list=CustomUser.objects.all()
	print (user_list)
	return render(request,'search.html',{'user_list':user_list, 'tab':'search'})



def follow_add(request):

	context=RequestContext(request)
	if request.method == 'POST':
		#request.POST
		print (request.user)
		user = CustomUser.objects.get(username=request.user)
		new_post = Follower(
			user_id=user.id,
			follow=request.POST.get('follow')
			)
		print (request.POST.get('follow'))
		print ("hello")
		new_post.save()
		return HttpResponseRedirect('/profile/'+request.POST.get('follow')+"/1")
	else:
		return render(request, 'playground_main.html', {'tab':'home'})

def follow_delete(request):

	context=RequestContext(request)
	if request.method == 'POST':
		#request.POST
		print ("here i am ")
		print (request.user)
		user = CustomUser.objects.get(username=request.user)
		print (user)
		Follower.objects.filter(user_id=user.id , follow=request.POST.get('follow')).delete()
		
		return HttpResponseRedirect('/profile/'+request.POST.get('follow')+"/1")
	else:
		return render(request, 'playground_main.html', {'tab':'home'})

def like_add(request):

	context=RequestContext(request)
	if request.method == 'POST':
		#request.POST
		new_post = Like(
			# the user will always be the logged in user
			# because a user can only create a entry for "his" like
			user_id=request.user.id,
            post_id=request.POST.get('post_id')
            )
		new_post.save()
		return render(request, 'playground_main.html', {'tab':'home'})
	else:
		return render(request, 'playground_main.html', {'tab':'home'})
def like_delete(request):

	context=RequestContext(request)
	if request.method == 'POST':
		#request.POST
		# print (request.user)
		user = CustomUser.objects.get(username=request.user)
		Like.objects.filter(user_id=user.id , post_id=request.POST.get('post_id')).delete()
		
		return render(request, 'playground_main.html', {'tab':'home'})
	else:
		return render(request, 'playground_main.html', {'tab':'home'})

def user_user(request):
	categories = ['funny','rock','hip_hop','pop','post_rock','punk','indie','acoustic','electronic','randb','country','jazz','classical']

	all_users=CustomUser.objects.all()
	all_user_category_array=[]
	user_index=0# the index of the current user

	for idx, user in enumerate(all_users):
		if(user==request.user):
			user_index=idx
		user_category_array=[]
		for category in categories:
			# get this user's post in this cat
			user_in_category=Post.objects.filter(category=category,user_id=user)
			# store these post counts
			user_category_array.append(len(user_in_category))
		# user_category_array describes a user's music taste in each category
		all_user_category_array.append(user_category_array)
	
	rec_array=all_user_category_array
	similarity=cosine_similarity([all_user_category_array[user_index]], all_user_category_array)
	# study cosine similarity
	# http://blog.christianperone.com/2013/09/machine-learning-cosine-similarity-for-vector-space-models-part-iii/
	# print ("similarity is ", similarity)
	# return
	
	recommend_dict={}
	for idx, user in enumerate(all_users):
		recommend_dict[user]= similarity[0][idx]


	# ranked_rec_dict=sorted(recommend_dict.iteritems(), key=lambda (k,v): (v,k),reverse=True)
	# http://stackoverflow.com/questions/32534822/sort-out-the-content-displayed-by-the-highest-number

	ranked_rec_dict=sorted(recommend_dict.items(), key=lambda x: (x[1],x[0]),reverse=True)
	#ranked_rec_dict = sorted(recommend_dict.keys())
	for idx, rec in enumerate(ranked_rec_dict):
		ranked_rec_dict[idx] =list(rec)[0] 

	print (recommend_dict)
	print (ranked_rec_dict)# sorted dict that ranks the users most similar to you 
	# this version still includes the current logged in user itself 
	return ranked_rec_dict
