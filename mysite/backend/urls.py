from django.urls import path
from backend.views import *

urlpatterns = [
    path('test/', Test.as_view(), name='test'),
    
]