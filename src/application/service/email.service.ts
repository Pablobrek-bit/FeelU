import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter = this.createTransporter();

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${process.env.APP_URL}/user/verify-email?token=${token}`;
    const emailHtml = this.buildVerificationEmailHtml(verificationUrl);

    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to: email,
        subject: 'Quase lá! só falta clicar nesse link 🔥',
        html: emailHtml,
      });
    } catch (e) {
      console.error('Error sending email:', e);
      throw new Error('Failed to send verification email');
    }
  }

  private createTransporter() {
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  private buildVerificationEmailHtml(verificationUrl: string): string {
    return `
      <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
        <h1>Bem-vindo ao Tindaria!</h1>
        <p>Estamos quase lá! Clique no botão abaixo para verificar seu e-mail:</p>
        <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; color: #fff; background-color: #007bff; text-decoration: none; border-radius: 5px;">Verificar E-mail</a>
        <p>Ou copie e cole o link no seu navegador:</p>
        <p>${verificationUrl}</p>
        <img src="cid:tindaria-logo" alt="Tindaria Logo" style="margin-top: 20px; width: 300px; height: auto;" />
      </div>
    `;
  }
}
