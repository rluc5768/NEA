import jwt
from decouple import config
from django.http import HttpResponse, JsonResponse


class Auth:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        response = self.get_response(request)
        # gets path after http://localhost:8000/api/v1/
        print(request.path[8:])
        endpoint = request.path[8:]
        print(request.method == "POST")
        print(endpoint == "user/")
        # There won't be validation if a POST request is make to the user/ or /login endpoints as there won't be any
        if not ((endpoint == "user/" or endpoint == "login/") and request.method == "POST"):
            print("NOT END POINT")
            if "Authorization" in request.headers:  # Authenticate 'JWT' token here.
                print("IN")
                token = request.headers["Authorization"]
                try:

                    payload = jwt.decode(token, config('AUTH_SECRET'),
                                         algorithms=["HS256"])
                    request.username = payload["username"]
                except:
                    # raise error - failed validation
                    return HttpResponse(status=401)

            else:  # raise exception - NO JWT
                return HttpResponse(status=401)

        return response

    # Called when there is an exception raised in the view.
    def process_exception(self, request, exception):
        # print(type(exception))
        match str(exception):  # What to do for each exception
            case "ValidationError":
                errors = {}
                for x in exception.error_list:
                    errors[x.code] = str(x.message)
                return JsonResponse({"type": "error", "detail": str(exception), "errors": errors})

            case _:
                JsonResponse({"type": "error", "detail": str(exception)})
