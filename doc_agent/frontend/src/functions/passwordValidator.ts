// this is function checks the users password before the user can access the application
export const validatePassword = (password: string) => {
  if (password.length < 8)
    return "password should be at least 8 characters long";
  if (!/[a-z]/.test(password))
    return "password should contain at least one lowercase letter";
  if (!/[A-Z]/.test(password))
    return "password should contain at least one uppercase letter";
  if (!/[0-9]/.test(password))
    return "password should contain at least one number";
  if (!/[@$!%*#?&]/.test(password))
    return "password should contain at least one special character";
  if (password === "")
    return "password should not contain spaces";
  return null; // password is valid
};
