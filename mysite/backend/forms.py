# Used so I can reuse the validation methods.
from django import forms
from django.forms import ModelForm
from .models import User
import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
import re
import hashlib


class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ['username',
                  'email',
                  'fname',
                  'sname',
                  'hashedPassword',
                  ]

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

    def hashPassword(self):
        encoded = self.hashedPassword.encode('utf-8')
        temp = encoded + self.uniqueSalt
        result = hashlib.sha256(temp)
        return result.hexdigest()

    def clean(self, exclude=None):
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
        if self.validatePassword():
            self.hashedPassword = self.hashPassword()
            print("hashed password {}".format(self.hashedPassword))
        else:
            errors.append(ValidationError(
                _('Password must must be at least 8 characters in length, contain 1 special character, uppercase and lowercase characters.'), code="InvalidPassword"))
        if len(errors) != 0:
            raise ValidationError(errors)


class LoginForm(forms.Form):
    username = forms.CharField(max_length=50)
    password = forms.CharField(max_length=128)
