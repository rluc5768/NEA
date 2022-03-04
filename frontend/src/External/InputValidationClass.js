class ValidateInputs {
  constructor() {
    this.firstName = "";
    this.surname = "";
    this.email = "";
    this.username = "";
    this.password = "";
  }

  validateFirstName() {
    if (this.firstName == "") return false;
    if (this.firstName.length > 35) return false;
    return true;
  }
  validateSurname() {
    //console.dir(this.surname.length);
    console.log(this.surname.length > 35);
    if (this.surname == "") return false;
    if (this.surname.length > 35) return false;
    return true;
  }
  validateEmail() {
    if (this.email == "") return false;

    return new RegExp("[a-z0-9]+@[a-z]+\\.[a-z]{2,3}").test(this.email);
  }
  validateUsername() {
    if (this.username == "") return false;
    if (this.username.length < 5 || this.username.length > 50) return false;
    return true;
  }
  validatePassword() {//Static allows the method to be called without instantiating the class.
    if (this.password == "") return false;
    if (this.password.length < 5) return false;

    let numberCharFlag = false;
    let lowercaseCharFlag = false;
    let uppercaseCharFlag = false;
    let specialCharFlag = false;
    for (let i = 0; i < this.password.length; i++) {
      const code = this.password[i].charCodeAt(0);
      if (
        (code >= 32 && code <= 47) ||
        (code >= 58 && code <= 64) ||
        (code >= 91 && code <= 96) ||
        (code >= 123 && code <= 126)
      )
        specialCharFlag = true;
      if (code >= 97 && code <= 122) lowercaseCharFlag = true;
      if (code >= 65 && code <= 90) uppercaseCharFlag = true;
      if (code >= 48 && code <= 57) numberCharFlag = true;
    }
    if (
      !specialCharFlag ||
      !lowercaseCharFlag ||
      !uppercaseCharFlag ||
      !numberCharFlag
    )
      return false;
    else return true;
  }
  allInputs(page) {
    let errors = [];

    if (!this.validateUsername()) errors.push("InvalidUsername");
    if (!this.validatePassword()) errors.push("InvalidPassword");
    if (page == "signUp") {
      if (!this.validateFirstName()) errors.push("InvalidFirstName");
      if (!this.validateSurname()) errors.push("InvalidSurname");
      if (!this.validateEmail()) errors.push("InvalidEmail");
    }

    return errors;
  }
}
export default ValidateInputs;
