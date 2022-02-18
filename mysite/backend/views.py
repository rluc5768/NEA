from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
import jwt
import time
from decouple import config
# Create your views here.

class Test(APIView):
    def post(self, request):
        return Response("hello")
class Login(APIView):
    def post(self, request):
        #==============Validating username and password for login ======================
        if len(request.data) != 2:
            return Response({"error":"Not the right amount of data."}) 
        print(request.data)
        payload = {
            "iat": int(time.time()),
            "username": request.data["username"],
            "subject": "auth"
        }
        encoded_jwt = jwt.encode(payload, config(  # will create own method to do this.
            'AUTH_SECRET'), algorithm="HS256")
        return Response({"token": encoded_jwt})
class AuthoriseUser(APIView):
    def post(self, request):#Here we authenticate the user.
        print(request.data)
        return Response(False)
