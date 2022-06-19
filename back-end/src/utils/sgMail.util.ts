// import sgMail from "@sendgrid/mail";
// import { Request, Response } from "express";
// import { MSG } from "../types/message";

// sgMail.setApiKey(
//   "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"
// );

// let msg: MSG;

// const sendMailRegister = (req: Request, res: Response) => {
//   const { name, email, password } = req?.body;
//   msg = {
//     from: "quang.kieu@timeedit.com",
//     to: email,
//     subject: "Crypto News - Verification Email",
//     text: `Hello, thanks for registering on our website.
//     Please click on the link below to verify your account:
//     http://${req.headers.host}/verify-email?token=${newUser.token}
//     `,
//     html: `
//     <h1>Hello ${name}</h1>
//     <p>Thanks for registering on our website.</p>
//     <p>Please click the link below to verify your account.</p>
//     <a href="http://${req.headers.host}/verify-email?token=${newUser.token}">Verify Your Account</>
//     `,
//   };
// };
