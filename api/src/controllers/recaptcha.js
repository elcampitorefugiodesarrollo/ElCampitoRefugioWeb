const axios = require('axios');

const validateRecaptcha = async (req, res) => {
  try {
    const captchaToken = req.body.captchaToken;
    console.log('token que llega', captchaToken);
    const tokenServer = process.env.RECAPTCHA_SECRET_KEY;
    const googleURL = process.env.RECAPTCHA_GOOGLE_URL;
    const verifyURL = `${googleURL}secret=${tokenServer}&response=${captchaToken}`;
    const validate = await axios.post(verifyURL);
    if (validate.data.success !== undefined && !validate.data.success) {
      res.status(404).send({
        success: false,
        msg: 'Failed captcha verification',
        error: validate.data['error-codes'],
      });
    }
    res.status(201).send(validate.data);
  } catch (e) {
    console.log({ error: 'Failed captcha verification' });
  }
};

module.exports = {
  validateRecaptcha,
};
