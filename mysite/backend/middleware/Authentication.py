import jwt
from decouple import config
from django.http import HttpResponse, JsonResponse


class Auth:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):

        # gets path after http://localhost:8000/api/v1/
        # Check if request ends in a trailing slash, if not append one to the end.

        endpoint = request.path[8:]
        no_auth_endpoints = [
            "user/",
            "login/",
            "uuidAndEmail/",
            "uuid/",
            "exchangeUUID/"
        ]
        print(endpoint in no_auth_endpoints)
        # There won't be validation if a POST request is make to the user/ or /login endpoints as there won't be any
        if not ((endpoint in no_auth_endpoints) and request.method == "POST"):

            if "Authorization" in request.headers:  # Authenticate 'JWT' token here.

                token = request.headers["Authorization"]
                # Remove Bearer
                token = token.replace("Bearer ", "")
                print(token)
                try:

                    payload = jwt.decode(token, config('AUTH_SECRET'),
                                         algorithms=["HS256"])
                    print(payload)
                    #print(hasattr(request, 'username'))
                    request.username = payload["username"]
                except:
                    # raise error - failed validation

                    return HttpResponse(status=401)

            else:  # raise exception - NO JWT
                return HttpResponse(status=401)

        if request.method == "GET":  # Setting params in url to request object.
            for key, value in request.GET.items():
                setattr(request, key, value)
        response = self.get_response(request)
        return response

    # Called when there is an exception raised in the view. EXCEPTIONS HANDLED HERE!!
    def process_exception(self, request, exception):
        # print(type(exception))
        print(type(exception).__name__)
        print(f"exc: {str(exception)} {type(exception)}  {exception}")

        match type(exception).__name__:  # matches each exception type

            case "ValidationError":
                errors = {}
                for x in exception.error_dict["__all__"]:
                    errors[x.code] = str(x.message)

                return JsonResponse({"type": "error", "code": "ValidationError", "errors": errors})
            case "TokenNotFoundException":
                return JsonResponse({"type": "error", "code": exception.code, "message": exception.message})
            case "InvalidTokenException":
                return JsonResponse({"type": "error", "code": exception.code, "message": exception.message, "sent_token": exception.sent_token})
            case "DoesNotExist":
                return JsonResponse({"type": "error", "code": "DoesNotExist", "message": "The data specified does not exist."})
            case "FieldDoesNotExist":
                return JsonResponse({"type": "error", "code": "FieldDoesNotExist", "message": "The specified field in the model does not exist."})
            case "MissingDataSentException":
                return JsonResponse({"type": "error", "code": exception.code, "message": exception.message})
            case "UUIDInvalidException":
                return JsonResponse({"type": "error", "code": exception.code, "message": exception.message})
            case "FieldCannotBeModifiedException":
                return JsonResponse({"type": "error", "code": exception.code, "message": exception.message})
            case "MultiValueDictKeyError":
                return JsonResponse({"type": "error", "code": "MissingData"})
            case "NoActiveWorkoutException":
                return JsonResponse({"type": "error", "code": exception.code, "message": exception.message})
            case _:
                JsonResponse({"type": "error", "detail": str(exception)})
