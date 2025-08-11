import nodemailer from "nodemailer";

// Basic email sending configuration
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    secure: true, // true for port 465, false for other ports
    auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
    },
});

// --- EMAIL TEMPLATES ---

const getVerificationEmailHtml = (name: string, url: string) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
    <h2 style="color: #333;">Welcome, ${name}!</h2>
    <p>Thanks for signing up. Please verify your email address by clicking the link below:</p>
    <p style="text-align: center;">
      <a href="${url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
    </p>
    <p>If you did not create an account, no further action is required.</p>
    <hr style="border: none; border-top: 1px solid #eee;" />
    <p style="font-size: 0.8em; color: #aaa;">ARIS</p>
  </div>
`;

const getPasswordResetEmailHtml = (url: string) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
    <h2 style="color: #333;">Password Reset Request</h2>
    <p>Hello,</p>
    <p>We received a request to reset your password. Click the link below to set a new one. This link will expire in 1 hour.</p>
    <p style="text-align: center;">
      <a href="${url}" style="background-color: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
    </p>
    <p>If you did not request a password reset, you can safely ignore this email.</p>
    <hr style="border: none; border-top: 1px solid #eee;" />
    <p style="font-size: 0.8em; color: #aaa;">ARIS</p>
  </div>
`;


// --- EMAIL SENDING FUNCTIONS ---

/**
 * Sends an email verification link to a new user.
 */
export async function sendVerificationEmail(to: string, name: string, token: string) {
    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify/${token}`;
    console.log("TRANS", transporter)
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject: "Verify Your Email Address",
        html: getVerificationEmailHtml(name, verificationUrl),
    });
}

/**
 * Sends a password reset link to a user.
 */
export async function sendPasswordResetEmail(to: string, token: string) {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset/${token}`; // Link to your frontend page
    
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject: "Reset Your Password",
        html: getPasswordResetEmailHtml(resetUrl),
    });
}