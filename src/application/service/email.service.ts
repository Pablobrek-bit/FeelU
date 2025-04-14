import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { env } from '../../shared/utils/env.utils';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter = this.createTransporter();

  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const verificationUrl = `${env.APP_URL}/user/verify-email?token=${token}`;
    const { html, text } = this.buildVerificationEmailContent(verificationUrl);

    try {
      await this.transporter.sendMail({
        from: `Tindaria Team <${env.EMAIL_USER}>`,
        to: email,
        subject: 'Verifique seu endereço de e-mail no Tindaria',
        html,
        text,
        headers: {
          'List-Unsubscribe': `<mailto:${env.EMAIL_USER}?subject=unsubscribe>`,
        },
      });
      this.logger.log(`Verification email sent to ${email}`);
    } catch (e) {
      console.error('Error sending email:', e);
      throw new Error('Failed to send verification email');
    }
  }

  private createTransporter() {
    return nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: Number(env.EMAIL_PORT),
      secure: false,
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASSWORD,
      },
    });
  }

  private buildVerificationEmailContent(verificationUrl: string): {
    html: string;
    text: string;
  } {
    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
        <h1 style="text-align: center; color: #007bff;">Bem-vindo ao Tindaria!</h1>
        <p>Olá,</p>
        <p>Obrigado por se registrar! Por favor, clique no botão abaixo para verificar seu endereço de e-mail e ativar sua conta:</p>
        <p style="text-align: center; margin: 30px 0;">
          <a href="${verificationUrl}" style="display: inline-block; padding: 12px 25px; color: #ffffff; background-color: #007bff; text-decoration: none; border-radius: 5px; font-weight: bold;">Verificar E-mail</a>
        </p>
        <p>Se o botão não funcionar, copie e cole o seguinte link no seu navegador:</p>
        <p style="word-break: break-all;">${verificationUrl}</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 0.9em; color: #777; text-align: center;">Se você não se registrou no Tindaria, por favor ignore este e-mail.</p>
      </div>
    `;

    // Versão em texto puro
    const text = `
Bem-vindo ao Tindaria!

Olá,

Obrigado por se registrar! Por favor, copie e cole o seguinte link no seu navegador para verificar seu endereço de e-mail e ativar sua conta:

${verificationUrl}

Se você não se registrou no Tindaria, por favor ignore este e-mail.
    `;

    return { html, text };
  }
}
