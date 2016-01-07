
from django.shortcuts import render
from django.http import HttpResponse
from django.http import JsonResponse

from django.core.exceptions import PermissionDenied

import json

from watson import search as watson

# Create your views here.
def search_tab_view(request):
	if request.method == "GET":
		return render(request, "search_tab.html", {
				'tab':'search',
			})
	else:
		return PermissionDenied

def full_text_search(request):
	if request.method == "POST":
		json_data = json.loads(request.body.decode('utf-8'))
		request_type = json_data['request_type']

		if request_type == "search":
			print ("json search text is ", json_data["search_text"])
			search_results = watson.search(json_data["search_text"])
			# print "object is ",search_results
			json_response = {
				"post_ids":[],
			}
			if search_results.count() == 0:
				# print "no result found"
				pass
			else:
				for a_result in search_results:
					json_response["post_ids"].append(a_result.meta["id"])
					# print "meta is ",a_result.meta
			return JsonResponse(json_response)
		else:
			return PermissionDenied
	else:
		return PermissionDenied