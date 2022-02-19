from django.urls import path
from .views import *

urlpatterns = [
    path('user/', UserView.as_view(), name="user"),
    path('login/', Login.as_view(), name="login"),
    path('authorise_user/', AuthoriseUser.as_view(), name="authorise_user")
]
