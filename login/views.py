from django.shortcuts import render

# Create your views here.
from login.forms import *
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout
from django.views.decorators.csrf import csrf_protect
from django.shortcuts import render_to_response
from django.http import HttpResponseRedirect
from django.template import RequestContext
from login.models import CustomUser
# from django.contrib.auth.models import User

 
@csrf_protect
def register(request):
    if request.method == 'POST':
        form = RegistrationForm(request.POST)
        if form.is_valid():
            # check no duplicate user name 
            result =  CustomUser.objects.filter(username=form.cleaned_data['username'])
            if len(result) != 0:
                return HttpResponseRedirect('/register/')
            user = CustomUser.objects.create_user(
                username=form.cleaned_data['username'],
                password=form.cleaned_data['password1'],
                email=form.cleaned_data['email'],
                user_image='/static/img/user_pic_blue_heart.gif',
            )
            # print ("user is!!!!!! ", user.id)
            return HttpResponseRedirect('/register/success/')
    else:
        form = RegistrationForm()
    
    variables = RequestContext(request, {
    'form': form
    })
    # variables = { 'form': form }    
 
    return render_to_response(
    'registration/register.html',
    variables,
    )
 
def register_success(request):
    return render_to_response(
    'registration/success.html',
    )
 
def logout_page(request):
    logout(request)
    return HttpResponseRedirect('/app')
 
@login_required
def home_login(request):
    return render(request,
    'playground_main.html',
    { 'user': request.user }
    )
