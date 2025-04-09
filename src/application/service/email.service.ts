import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.APP_URL}/user/verify-email?token=${token}`;

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Email Verification',
        html: `<p>Click the link below to verify your email:</p>
             <a href="${verificationUrl}">${verificationUrl}</a>`,
      });
    } catch (e) {
      console.error('Error sending email:', e);
      throw new Error('Failed to send verification email');
    }
  }
}
