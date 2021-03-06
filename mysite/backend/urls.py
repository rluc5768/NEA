from django.urls import path
from .views import *

urlpatterns = [
    path('user/', UserView.as_view(), name="user"),
    path('login/', Login.as_view(), name="login"),
    path('authorise_user/', AuthoriseUserView.as_view(), name="authorise_user"),
    path('activity/', ActivityView.as_view(), name='activity'),
    path('uuidAndEmail/', GenerateUUIDAndSendMail.as_view(), name="uuidAndEmail"),
    path('uuid/', UUID.as_view(), name="uuid"),
    path("exchangeUUID/", ExchangeUUIDForJWT.as_view(), name="exchangeForJWT"),
    path("personal_bests/", PersonalBestsView.as_view(), name="personal_best"),

    path('workout_plan', WorkoutPlanView.as_view(), name='workout_plan'),
    path('exercises', ExerciseView.as_view(), name="exercises")
]
