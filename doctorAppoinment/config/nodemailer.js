const nodemailer= require("nodemailer")

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, 
    auth: {
      user: "scongresses@gmail.com",
      pass: "olgdeljpsdwmfzuc",
    },
  });

module.exports= transporter;