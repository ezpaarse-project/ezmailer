const Joi = require('joi');

const { sendMail, generateMail } = require('../services/mail');
const { name, version } = require('../../package.json');

exports.index = (req, res) => res.status(200).json(
  {
    statusCode: 200,
    payload: {
      data: {
        name,
        version,
      },
      message: null,
    },
  },
);

exports.send = async (req, res) => {
  const schema = Joi.object({
    from: Joi.array().min(1).items(Joi.string()).required(),
    to: Joi.array().min(1).items(Joi.string()).required(),
    cc: Joi.array().items(Joi.string()),
    subject: Joi.string().trim().required(),
    data: Joi.object(),
    attachments: Joi.object({
      filename: Joi.string().trim().required(),
      content: Joi.binary().required(),
    }),
    template: Joi.string().trim().required(),
    // template: Joi.object({
    //   mjml: Joi.string().trim().required(),
    //   text: Joi.string().trim().required(),
    // }).required(),
  });


  const { body } = req;

  const { error } = schema.validate(body);
  if (error) {
    return res.boom.badRequest(error);
  }

  const template = generateMail(body.template, body.data);

  try {
    await sendMail({
      ...body,
      ...template,
    });
  } catch (err) {
    return res.boom.internal(err);
  }

  return res.status(200).json({
    statusCode: 200,
    payload: {
      data: null,
      message: 'Mail sent',
    },
  });
};
