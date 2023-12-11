const yup = require("yup");

const UserRegistartionLoginSchema = yup.object().shape({
  username: yup.string().required("Username is required."),
  password: yup.string().required("Password is required"),
});

module.exports = { UserRegistartionLoginSchema };
