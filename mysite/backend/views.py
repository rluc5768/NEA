from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
import jwt
import time
from decouple import config
from .forms import *
import json
import os
# Create your views here.


def create_jwt(username):
    payload = {
        "iat": int(time.time()),
        "username": username,
        "subject": "auth"
    }
    return jwt.encode(payload, config('AUTH_SECRET'), algorithm="HS256")


class UserView(APIView):
    def post(self, request):  # create a new user
        print(request.data)

        try:
            newUser = User(username=request.data['username'], email=request.data['email'], fname=request.data['firstName'],
                           sname=request.data['surname'], hashedPassword=request.data['password'], uniqueSalt=os.urandom(32))  # password will be hashed if valid when validating the fields of the model
            newUser.full_clean()  # checks if data entered is valid
            newUser.save()  # performs an insert sql statement.

            print(newUser)
            return Response({'token': create_jwt(newUser.username)}, status=200)
        except ValidationError as e:
            errorCodeList = []
            # print(e.error_dict["__all__"][0].message)
            for x in e.error_dict["__all__"]:

                errorCodeList.append(
                    {"message": str(x.message), "code": x.code})
            print(e)
            return Response(json.dumps(errorCodeList), status=200)
        except:
            return Response({'message': 'The data entered is invalid', 'code': 'invalidData'})


class Login(APIView):
    def post(self, request):
        # ==============Validating username and password for login ======================
        if len(request.data) != 2:
            return Response({"error": "Not the right amount of data."})
        print(request.data)
        encoded_jwt = create_jwt(request.data["username"])
        return Response({"token": encoded_jwt})


class AuthoriseUser(APIView):
    def post(self, request):  # Here we authenticate the user.
        print(request.data)
        return Response(False)
