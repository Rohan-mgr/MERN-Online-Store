export const validateForm = (formData, method) => {
  const { name, email, password } = formData;
  const errors = {};
  let nameRegex = /^(?![\s.]+$)[a-zA-Z\s.]{2,}$/g;
  let emailRegex =
    /^[a-zA-Z0-9!@#$%^&*_?{}~-]+(\.[a-zA-Z0-9!@#$%^&*_?{}~-]+)*@([a-z0-9]+([a-z0-9-]*)\.)+[a-zA-Z]+$/g;
  let passRegex =
    /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*-_=?])[a-zA-Z0-9!@#$%^&*-_=?]{8,}/g;

  if (method === "signup") {
    if (!name || name.trim() === "")
      errors.name = "Please Enter Your Full Name";
    else if (!name.match(nameRegex))
      errors.name =
        "Name must have at least two letters and not include numbers";
  }

  if (!email || email.trim() === "") errors.email = "Please Enter Your Email";
  else if (!email.match(emailRegex)) errors.email = "Please Enter Valid Email";

  if (!password || password.trim() === "")
    errors.password = "Please Enter Your Password";
  else if (!password.match(passRegex))
    errors.password =
      method === "signin"
        ? "Incorrect Password"
        : "Weak Password. Must Include special charaters, Capital letters and at least 8 characters";

  return errors;
};

export const cartTotalPrice = (items) => {
  let sum = 0;
  items?.map((p) => {
    return (sum += p.productId.price * p.quantity);
  });
  return sum;
};
