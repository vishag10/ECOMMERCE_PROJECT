


export const validateEmail = (email) => {
    if (!email) {
      return { isValid: false, error: "Email is required" };
    }
  
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return { isValid: false, error: "Invalid email format" };
    }
  
   
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!gmailRegex.test(email)) {
      return { isValid: false, error: "Please use a valid Gmail address" };
    }
  
    return { isValid: true, error: "" };
  };
  
  export const validatePassword = (password) => {
    if (!password) {
      return { isValid: false, error: "Password is required" };
    }
  
    if (password.length < 8) {
      return { isValid: false, error: "Password must be at least 8 characters long" };
    }
  
    if (!/[A-Z]/.test(password)) {
      return { isValid: false, error: "Password must contain at least one uppercase letter" };
    }
  
   
    if (!/[a-z]/.test(password)) {
      return { isValid: false, error: "Password must contain at least one lowercase letter" };
    }
  
   
    if (!/[0-9]/.test(password)) {
      return { isValid: false, error: "Password must contain at least one number" };
    }
  
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      return { isValid: false, error: "Password must contain at least one special character" };
    }
  
    return { isValid: true, error: "" };
  };
  
 
  export const validateConfirmPassword = (password, confirmPassword) => {
    if (!confirmPassword) {
      return { isValid: false, error: "Please confirm your password" };
    }
  
    if (password !== confirmPassword) {
      return { isValid: false, error: "Passwords do not match" };
    }
  
    return { isValid: true, error: "" };
  };
  
  
  export const validateUsername = (username) => {
    if (!username) {
      return { isValid: false, error: "Username is required" };
    }
  
    if (username.length < 3) {
      return { isValid: false, error: "Username must be at least 3 characters long" };
    }
  
    
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return { isValid: false, error: "Username can only contain letters, numbers, and underscores" };
    }
  
    return { isValid: true, error: "" };
  };
  
 
  export const validatePhone = (phone) => {
    if (!phone) {
      return { isValid: false, error: "Phone number is required" };
    }
  
   
    if (!/^\d{10}$/.test(phone.replace(/\D/g, ''))) {
      return { isValid: false, error: "Please enter a valid 10-digit phone number" };
    }
  
    return { isValid: true, error: "" };
  };
  
 
  export const validateForm = (data) => {
    const { username, email, phone, password, cpassword } = data;
    
    const usernameValidation = validateUsername(username);
    const emailValidation = validateEmail(email);
    const phoneValidation = validatePhone(phone);
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation = validateConfirmPassword(password, cpassword);
    
    const errors = {
      username: usernameValidation.error,
      email: emailValidation.error,
      phone: phoneValidation.error,
      password: passwordValidation.error,
      cpassword: confirmPasswordValidation.error
    };
    
    const isValid = 
      usernameValidation.isValid && 
      emailValidation.isValid && 
      phoneValidation.isValid && 
      passwordValidation.isValid && 
      confirmPasswordValidation.isValid;
    
    return { isValid, errors };
  };