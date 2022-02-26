from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
import jwt
import time
from decouple import config
import json
import os
from .validation import *
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
import hashlib
from .models import *
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
            return Response({'type': 'auth_token', 'token': create_jwt(newUser.username)}, status=200)
        except ValidationError as e:
            errorCodeList = {}
            for x in e.error_dict["__all__"]:
                errorCodeList[x.code] = str(x.message)

            return Response({'type': 'validation_error', 'errors': errorCodeList}, status=200)
        except:
            return Response({'type': 'validation_error', 'errors': {'invalidData': 'The data entered is invalid'}})


class Login(APIView):
    def post(self, request):

        # ==============Validating username and password for login ======================
        try:
            errors = []

            if len(request.data) != 2:
                errors.append(ValidationError(
                    _('The username and password must be submitted in the request.'), code="IncorrectAmountOfData"))
                raise ValidationError(errors)
            else:
                username = request.data["username"]
                password = request.data["password"]
                if not validatePassword(password):
                    errors.append(
                        ValidationError(
                            _('Password must must be at least 8 characters in length, contain 1 special character, uppercase and lowercase characters.'), code="InvalidPassword"))
                if len(username) < 5 or len(username) > 50 or ' ' in username or '/' in username:
                    errors.append(ValidationError(
                        _('Username must be between 5 and 50 character and not contain " " or "/".'), code="InvalidUsername"))
                if not User.objects.filter(username=username).exists():
                    errors.append(ValidationError(
                        _('Username does not exist.'), code="UsernameDoesNotExists"))
                print(request.data)
                print(errors)
                if len(errors) != 0:
                    raise ValidationError(errors)
                # Data is valid if this happens (WE KNOW THE USER EXISTS IF IT REACHES HERE), now check if the user exists and compare the hashed passwords.

                else:

                    user = User.objects.get(pk=username)
                    # Compare the user's hashed password with the submitted password.
                    encoded = password.encode('utf-8')
                    temp = encoded + user.uniqueSalt
                    result = hashlib.sha256(temp)
                    print("H pwd: "+user.hashedPassword)
                    print("O hash: "+result.hexdigest())
                    if result.hexdigest() == user.hashedPassword:
                        encoded_jwt = create_jwt(request.data["username"])
                        return Response({"token": encoded_jwt})
                    else:

                        raise ValidationError(
                            _('Password is incorrect.'), code="IncorrectPassword")

        except ValidationError as e:
            errorCodeList = []

            for x in e.error_list:

                errorCodeList.append(
                    {"message": str(x.message), "code": x.code})
            print(e)
            return Response(errorCodeList, status=200)

        # =========================================================================

        # print(request.data)


# Boolean return based on if the JWT sent is valid.
class AuthoriseUserView(APIView):
    def post(self, request):  # Here we authenticate the user (JWT).
        print(request.data)
        if request.data == None:
            return Response(False)
        jwt_token = request.data
        dotCounter = 0
        for c in jwt_token:
            if c == '.':
                dotCounter += 1
        if dotCounter != 2:  # token must contain 2 dots to split the string into 3 sections: header, payload, signature
            return Response(False)
        # ======================= HEADER will be checked for my implementation ========================
        # =============================================================================================
        try:
            jwt.decode(jwt_token, config(
            'AUTH_SECRET'), algorithms=["HS256"])
             # verify that payload is valid json and
        except:
            
            return Response(False) #Invalid signature error will be returned if it fails jwt.decode.
        return Response(True)
