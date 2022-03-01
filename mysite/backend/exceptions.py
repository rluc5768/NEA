class FormInputException(Exception):
    def __init__(self, errors):  # Pass the error dict into the exception
        self.errors = errors

class TokenNotFoundException(Exception):
    def __init__(self):
        self.code = "TokenNotFound"
        self.message = "JWT token not found in request body."
class InvalidTokenException(Exception):
    def __init__(self, token):
        self.code = "InvalidToken"
        self.message = "The JWT token is invalid."
        self.sent_token = token