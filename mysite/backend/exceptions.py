

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
        self.code = "MissingData"
        self.message = "There are missing mandatory fields in the body of the request."


class UUIDInvalidException(Exception):
    def __init__(self, reason):
        self.code = f"{reason}UUID"
        match reason:
            case "Expired":
                self.message = "The uuid must be used within 2 hours."
            case "Empty":
                self.message = "The uuid must not be empty."
            case "NotMatching":
                self.message = "The uuid's do not match."


class FieldCannotBeModifiedException(Exception):
    def __init__(self):
        self.code = "FieldCannotBeModified"
        self.message = "The specified field cannot be modified"


class ParamsNotFoundException():
    pass


class NoActiveWorkoutException(Exception):
    def __init__(self):
        self.code = "NoActiveWorkout"
        self.message = "No active workout is selected."
