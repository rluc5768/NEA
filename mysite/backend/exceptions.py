class FormInputException(Exception):
    def __init__(self, errors):  # Pass the error dict into the exception
        self.errors = errors
