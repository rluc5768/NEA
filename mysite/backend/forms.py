#Used so I can reuse the validation methods.
from django import forms
from django.forms import ModelForm
from backend.models import User
class UserFrom(forms.ModelForm):
    class Meta:
        model = User


class LoginForm(forms.Form):
    username = forms.CharField(max_length=50)
    password = forms.CharField(max_length=128)