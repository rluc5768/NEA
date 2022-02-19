from django.db import models
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import re
import hashlib
from .validation import *
# Create your models here.


class User(models.Model):
    username = models.CharField(primary_key=True, max_length=50)
    email = models.CharField(null=False, max_length=320)
    fname = models.CharField(null=False, max_length=35)
    sname = models.CharField(null=False, max_length=35)
    hashedPassword = models.CharField(null=False, max_length=64)
    uniqueSalt = models.BinaryField(max_length=32)
    stravaAuthorised = models.BooleanField(default=False)
    stravaAccessToken = models.CharField(default='', max_length=40)
    stravaRefreshToken = models.CharField(default='', max_length=40)
    stravaAccessTokenExpiresAt = models.IntegerField(null=True)
    verifiedViaEmail = models.BooleanField(default=False)

    def __str__(self):
        '''String represents the model object'''
        return self.username

    '''
    def validatePassword(self):
        # No upper limit as password will be hashed.
        if(len(self.hashedPassword) < 5):
            return False
        NoSpecialCharacter = True
        NoNumber = True
        NoUppercase = True
        NoLowercase = True
        for char in self.hashedPassword:
            asciiValue = ord(char)
            # Check for special character
            if (asciiValue >= 32 and asciiValue <= 47) or (asciiValue >= 58 and asciiValue <= 64) or (asciiValue >= 91 or asciiValue <= 96) or (asciiValue >= 123 and asciiValue <= 126):
                NoSpecialCharacter = False
            if asciiValue >= 48 and asciiValue <= 57:
                NoNumber = False
            if asciiValue >= 65 and asciiValue <= 90:
                NoUppercase = False
            if asciiValue >= 97 and asciiValue <= 122:
                NoLowercase = False
        if NoSpecialCharacter or NoNumber or NoUppercase or NoLowercase:
            return False
        return True
   '''

    def hashPassword(self):
        encoded = self.hashedPassword.encode('utf-8')
        temp = encoded + self.uniqueSalt
        result = hashlib.sha256(temp)
        return result.hexdigest()

    def clean_fields(self, exclude=None):
        errors = []
        # Email validation
        if not re.fullmatch(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', self.email):
            errors.append(ValidationError(_('Email must be valid'),
                          code="InvalidEmail", params={"email": self.email}))
        if User.objects.filter(email=self.email).exists():
            errors.append(ValidationError(
                _('Email is already in use'), code="EmailAlreadyExists"))
        # Validate FirstName
        if len(self.fname) > 35 or self.fname == '':
            errors.append(ValidationError(
                _('First name must be less than or equal to 35 characters.'), code="InvalidFirstName"))
        # Validate Surname
        if len(self.sname) > 35 or self.sname == '':
            errors.append(ValidationError(
                _('Surname must be less than or equal to 35 characters.'), code="InvalidSurname"))
        # Validate Username
        if len(self.username) < 5 or len(self.username) > 50 or ' ' in self.username or '/' in self.username:
            errors.append(ValidationError(
                _('Username must be between 5 and 50 character and not contain " " or "/".'), code="InvalidUsername"))
        if User.objects.filter(username=self.username).exists():
            errors.append(ValidationError(
                _('Username already in use.'), code="UsernameAlreadyExists"))
        # Validate Password
        if validatePassword(self.hashedPassword):
            self.hashedPassword = self.hashPassword()
            print("hashed password {}".format(self.hashedPassword))
        else:
            errors.append(ValidationError(
                _('Password must must be at least 8 characters in length, contain 1 special character, uppercase and lowercase characters.'), code="InvalidPassword"))
        if len(errors) != 0:
            raise ValidationError(errors)


class ActivityDetail(models.Model):
    activity_id = models.CharField(primary_key=True, max_length=17)
    activity_date = models.DateTimeField()
    distance = models.DecimalField(decimal_places=3, max_digits=8)
    polyline = models.CharField(max_length=512)
    exercise_type = models.CharField(max_length=2)
    moving_time = models.IntegerField()
    elapsed_time = models.IntegerField()


class Activity(models.Model):
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    activity_id = models.ForeignKey(ActivityDetail, on_delete=models.CASCADE)


class WorkoutPlan(models.Model):
    workout_plan_id = models.CharField(primary_key=True, max_length=80)
    days_of_the_week = models.CharField(max_length=7)
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    workout_plan_name = models.CharField(null=False, max_length=30)
    workout_streak = models.IntegerField()


class Workout(models.Model):
    workout_id = models.CharField(primary_key=True, max_length=100)
    workout_plan_id = models.ForeignKey(WorkoutPlan, on_delete=models.CASCADE)
    workout_name = models.CharField(null=False, max_length=30)
    workout_date = models.DateTimeField(null=False)


class Exercise(models.Model):
    exercise_name = models.CharField(primary_key=True, max_length=40)
    brief_description = models.CharField(max_length=200)


class ExerciseInWorkout(models.Model):
    exercise_name = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    workout_id = models.ForeignKey(Workout, on_delete=models.CASCADE)
    sets = models.IntegerField()
    reps = models.IntegerField()
    weight = models.DecimalField(max_digits=5, decimal_places=2)


class Muscle(models.Model):
    muscle_name = models.CharField(primary_key=True, max_length=40)
    function = models.CharField(max_length=75)
    location = models.CharField(max_length=50)
    origin = models.CharField(max_length=50)
    insertion = models.CharField(max_length=50)


class MuscleWorked(models.Model):
    excercise_name = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    muscle_name = models.ForeignKey(Muscle, on_delete=models.CASCADE)


class PersonalBest(models.Model):
    pb_id = models.CharField(primary_key=True, max_length=100)
    username = models.ForeignKey(User, on_delete=models.CASCADE)
    exercise_name = models.ForeignKey(Exercise, on_delete=models.CASCADE)
    sets = models.IntegerField()
    reps = models.IntegerField()
    weight = models.DecimalField(max_digits=5, decimal_places=2)
