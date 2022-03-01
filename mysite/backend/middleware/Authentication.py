import jwt
from decouple import config
from django.http import HttpResponse, JsonResponse


class Auth:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        
        # gets path after http://localhost:8000/api/v1/
        
        endpoint = request.path[8:]
        
        # There won't be validation if a POST request is make to the user/ or /login endpoints as there won't be any
        if not ((endpoint == "user/" or endpoint == "login/") and request.method == "POST"):
            
            if "Authorization" in request.headers:  # Authenticate 'JWT' token here.
                
                token = request.headers["Authorization"]
                try:

                    payload = jwt.decode(token, config('AUTH_SECRET'),
                                         algorithms=["HS256"])
                    #print(hasattr(request, 'username'))
                    request.username = payload["username"]
                except:
                    # raise error - failed validation
                    return HttpResponse(status=401)

            else:  # raise exception - NO JWT
                return HttpResponse(status=401)
        response = self.get_response(request)
        return response

    # Called when there is an exception raised in the view. EXCEPTIONS HANDLED HERE!!
    def process_exception(self, request, exception):
        # print(type(exception))
        match str(exception):  # matches each exception type
            case "ValidationError":
                errors = {}
                for x in exception.error_list:
                    errors[x.code] = str(x.message)
                return JsonResponse({"type": "error", "detail": str(exception), "errors": errors})

            case _:
                JsonResponse({"type": "error", "detail": str(exception)})
