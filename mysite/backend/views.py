from email.policy import default
from http.client import HTTPException
import math
from textwrap import indent
from django.conf import settings
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
from django.core.exceptions import ValidationError, FieldDoesNotExist
import hashlib
from .models import *
from .exceptions import *
import uuid
from django.core.mail import send_mail
from datetime import datetime, timedelta
# Create your views here.


def create_jwt(username):
    payload = {
        "iat": int(time.time()),
        "username": username,
        "subject": "auth"
    }
    return jwt.encode(payload, config('AUTH_SECRET'), algorithm="HS256")


def authenticate_jwt(token):  # Is user logged in?
    if token == None:
        print("response: False")
        return False

    dotCounter = 0
    for c in str(token):

        if c == '.':

            dotCounter += 1
    if dotCounter != 2:  # token must contain 2 dots to split the string into 3 sections: header, payload, signature

        return False

    # ======================= HEADER will be checked for my implementation ========================
    # =============================================================================================

    payload = jwt.decode(token, config(
        'AUTH_SECRET'), algorithms=["HS256"])

    return True
    # verify that payload is valid json and


class UserView(APIView):
    def put(self, request):
        print(request.username)

        user = User.objects.get(username=request.username)
        for key in request.data.keys():

            if key == "password":
                setattr(user, "hashedPassword", hashlib.sha256(
                    request.data[key].encode('utf-8') + user.uniqueSalt).hexdigest())

            elif key == "email":
                raise FieldCannotBeModifiedException()
            else:
                if not hasattr(user, key):
                    raise FieldDoesNotExist
                setattr(user, key, request.data[key])

        user.save()
        return Response({"type": "update_confirmation"})

    def get(self, request):
        user = User.objects.get(username=request.username)
        return Response({"type": "user_details", "details": {"username": user.username, "email": user.email, "firstName": user.fname, "surname": user.sname, "stravaAuthorised": user.stravaAuthorised, "stravaAccessToken": user.stravaAccessToken, "stravaRefreshToken": user.stravaRefreshToken, "stravaAccessTokenExpiresAt": user.stravaAccessTokenExpiresAt}}, status=200)

    def post(self, request):  # create a new user
        newUser = User(username=request.data['username'], email=request.data['email'], fname=request.data['firstName'],
                       sname=request.data['surname'], hashedPassword=request.data['password'], uniqueSalt=os.urandom(32))  # password will be hashed if valid when validating the fields of the model
        newUser.full_clean()  # checks if data entered is valid
        newUser.save()  # performs an insert sql statement.
        print(newUser)
        return Response({'type': 'auth_token', 'token': create_jwt(newUser.username)}, status=200)

    def delete(self, request):
        User.objects.get(username=request.username).delete()
        return Response({"type": "delete_confirmation"})


class Login(APIView):

    # Returns a JWT if the username and hashed password match.
    def post(self, request):

        # ==============Validating username and password for login ======================

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
                    return Response({"type": "auth_token", "token": encoded_jwt})
                else:

                    raise ValidationError(
                        _('Password is incorrect.'), code="IncorrectPassword")

        # =========================================================================

        # print(request.data)


# Boolean return based on if the JWT sent is valid.
class AuthoriseUserView(APIView):
    def get(self, request):  # Here we authenticate the user (JWT).
        '''print(request.data)
        if "token" not in request.data:
            raise TokenNotFoundException()
        token = request.data["token"]
        is_auth = authenticate_jwt(token)
        if is_auth:
            '''
        return Response({"type": "authorised", "username": request.username})  # Token will be authorised in middleware
        ''' else:
            raise InvalidTokenException(token)'''


class ActivityView(APIView):
    def get(self, request):
        activities = Activity.objects.filter(username=request.username)
        dict = {}
        for a in activities:

            dict[a.activity.activity_id] = {
                "activity_date": a.activity.activity_date,
                "distance": a.activity.distance,
                "polyline": a.activity.polyline,
                "exercise_type": a.activity.exercise_type,
                "moving_time": a.activity.moving_time,
                "elapsed_time": a.activity.elapsed_time,
                "activity_name": a.activity.activity_name,

            }
            # print(dict)
        print(len(dict.keys()))
        return Response({"type": "success", "activities": dict})

    def post(self, request):  # Save activities to dataBase.
        print(request.data)
        if "activities" in request.data:
            activities = request.data["activities"]
            user = User.objects.get(username=request.username)
            for activity in activities:

                if not Activity.objects.filter(activity_id=activity["id"], username=request.username).exists():
                    # Save to database, activity["id"] is the key not a field.
                    a = ActivityDetail(activity_id=activity["id"], activity_date=activity["start_date"], distance=activity["distance"], polyline=activity["map"]
                                       ["summary_polyline"], exercise_type=activity["type"], moving_time=activity["moving_time"], elapsed_time=activity["elapsed_time"])
                   # a.full_clean()
                   # Create a correspondin entry to activity (link table)
                    link = Activity(username=user, activity=a)
                   # link.full_clean()

                    a.save()
                    link.save()
                print(json.dumps(activity, indent=4))
            return Response({"type": "activities_added"})
        else:
            raise MissingDataSentException()


class GenerateUUIDAndSendMail(APIView):
    # UUID V4 will be used as it uses random characters and incorporates a timestamp.
    def post(self, request):
        if "username" in request.data:
            id = uuid.uuid1()  # Universally unique identifier (includes a timestamp of creation)
            user = User.objects.get(username=request.data["username"])
            user.uuid = id
            user.save()
            # SEND EMAIL HERE - would add more security features, such as a security question.
            send_mail(
                subject='Password reset - Workout Planner',
                message=f'Reset password here: http://localhost:3000/resetPassword/{request.data["username"]}?uuid={id}',
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[user.email],
                fail_silently=False
            )

            return Response({"type": "success"})
        else:
            raise MissingDataSentException()


class UUID(APIView):
    # receives username, returns uuid stored in DB if timestamp is within 2 hours.
    def post(self, request):
        if "username" in request.data:
            user = User.objects.get(username=request.data["username"])
            if(user.uuid != ""):
                print("UUID: "+user.uuid)
                id = uuid.UUID(str(user.uuid))

                time_since_epoch = math.floor(
                    (id.time - int("0x01b21dd213814000", 16)) * 10**-7)
                # If the uuid was created less than 2 hours ago
                if int(time.time()) - time_since_epoch < 60 * 60 * 2:
                    return Response({"type": "success", "uuid": user.uuid})
                else:
                    raise UUIDInvalidException("Expired")
            else:
                raise UUIDInvalidException("Empty")
        else:
            raise MissingDataSentException()


class ExchangeUUIDForJWT(APIView):  # Username and UUID sent.
    def post(self, request):
        if "username" in request.data and "uuid" in request.data:  # Data needed is present.
            user = User.objects.get(username=request.data["username"])
            if user.uuid == request.data["uuid"]:
                # So that the uuid cannot be reused to get another JWT.
                user.uuid = ""
                user.save()
                encoded_jwt = create_jwt(request.data["username"])
                print(encoded_jwt)
                return Response({"type": "auth_token", "token": encoded_jwt})
            else:
                raise UUIDInvalidException("NotMatching")
        else:
            raise MissingDataSentException()


class PersonalBestsView(APIView):
    def get(self, request):
        return Response("HEllo there")


class WorkoutPlanView(APIView):
    # Params assigned to request in authentication middleware.
    def get(self, request):
        # return active workout plan, if that is "" then return "NoWorkoutplanActive".
        if request.workout_plan == "":
            user = User.objects.get(username=request.username)
            request.workout_plan = user.currentWorkoutPlanActive
            print(request.workout_plan)
        print(f"Plan: {request.workout_plan}")
        return Response(request.workout_plan)
