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
class MissingDataSentException(Exception):
    def __init__(self):
        self.code = "MissingData";
        self.message = "There are missing mandatory fields in the body of the request.";
class UUIDInvalidException(Exception):
    def __init__(self, reason):
        self.code = f"{reason}UUID"
        self.message = "The uuid must be used within 2 hours." if reason == "Expired" else "The uuid must not be empty."
class FieldCannotBeModifiedException(Exception):
    def __init__(self):
        self.code = "FieldCannotBeModified"
        self.message = "The specified field cannot be modified"