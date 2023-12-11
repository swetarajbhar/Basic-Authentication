const yup = require("yup");

const validate = (schema) => async (req, res, next) => {
  try {
    if (!schema || !yup.isSchema(schema)) return next();

    req.body = await schema.validate(req.body, {
      abortEarly: false,
      strict: false,
      stripUnknown: true,
    });

    next();
  } catch (err) {
    return res.status(400).json({ type: err.name, message: err.message });
  }
};

module.exports = {
  validate,
};
