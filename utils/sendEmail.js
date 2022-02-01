const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // creating the transporter object
  const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: "a362424a561ca2",
      pass: "5f561b67b3bbf2",
    },
  });
  //create the mail options
  const mailOptions = {
    from: "Laxman Sharma <laxman@gmail.com>",
    to: options.email,
    message: options.message,
    text: options.text,
  };
  //actually sending the email
  await transport.sendMail(mailOptions);
};
module.exports = sendEmail;
