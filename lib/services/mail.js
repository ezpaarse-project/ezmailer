const path = require('path');
const fs = require('fs-extra');
const nunjucks = require('nunjucks');
const mjml2html = require('mjml');
const nodemailer = require('nodemailer');
const { smtp } = require('config');

const templatesDir = path.resolve(process.cwd(), 'templates');
const imagesDir = path.resolve(templatesDir, 'images');
const transporter = nodemailer.createTransport(smtp);

nunjucks.configure(templatesDir);

const images = fs.readdirSync(imagesDir);

module.exports = {
  async sendMail(mailOptions) {
    const options = mailOptions || {};
    options.attachments = options.attachments || [];

    images.forEach((image) => {
      options.attachments.push({
        filename: image,
        path: path.resolve(imagesDir, image),
        cid: image,
      });
    });

    return new Promise((resolve, reject) => {
      transporter.sendMail(options, (err, info) => {
        if (err) { return reject(err); }
        return resolve(info);
      });
    });
  },

  generateMail(template, locals = {}) {
    if (!template) { throw new Error('No template name provided'); }

    const text = nunjucks.render(`${template}.txt`, locals);
    const mjmlTemplate = nunjucks.render(`${template}.mjml`, locals);
    // const text = nunjucks.render(template.text, locals);
    // const mjmlTemplate = nunjucks.render(template.mjml, locals);
    const { html, errors } = mjml2html(mjmlTemplate);
    return { html, text, errors };
  },
};
