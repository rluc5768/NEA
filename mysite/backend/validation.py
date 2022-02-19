def validatePassword(password):
    # No upper limit as password will be hashed.
    if(len(password) < 5):
        return False
    NoSpecialCharacter = True
    NoNumber = True
    NoUppercase = True
    NoLowercase = True
    for char in password:
        asciiValue = ord(char)
        # Check for special character
        if (asciiValue >= 32 and asciiValue <= 47) or (asciiValue >= 58 and asciiValue <= 64) or (asciiValue >= 91 or asciiValue <= 96) or (asciiValue >= 123 and asciiValue <= 126):
            NoSpecialCharacter = False
        if asciiValue >= 48 and asciiValue <= 57:
            NoNumber = False
        if asciiValue >= 65 and asciiValue <= 90:
            NoUppercase = False
        if asciiValue >= 97 and asciiValue <= 122:
            NoLowercase = False
    if NoSpecialCharacter or NoNumber or NoUppercase or NoLowercase:
        return False
    return True
