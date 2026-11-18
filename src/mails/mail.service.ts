import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  async sendVerificationEmail(email: string, token: string): Promise<void> {
    const host = process.env.MAILER_HOST?.trim();
    const port = Number(process.env.MAILER_PORT);
    const user = process.env.MAILER_USER?.trim();
    const password = process.env.MAILER_PASSWORD;
    const from = process.env.MAILER_FROM?.trim();
    const secureValue = process.env.MAILER_SECURE?.trim().toLowerCase();

    const missingSettings = [
      ['MAILER_HOST', host],
      ['MAILER_PORT', process.env.MAILER_PORT],
      ['MAILER_USER', user],
      ['MAILER_PASSWORD', password],
      ['MAILER_FROM', from],
    ]
      .filter(([, value]) => !value)
      .map(([name]) => name);

    if (
      missingSettings.length > 0 ||
      !Number.isInteger(port) ||
      port <= 0
    ) {
      const missing = missingSettings.length
        ? missingSettings.join(', ')
        : 'a valid MAILER_PORT';
      throw new InternalServerErrorException(
        `Email service is not configured. Set ${missing}.`,
      );
    }

    if (secureValue && secureValue !== 'true' && secureValue !== 'false') {
      throw new InternalServerErrorException(
        'MAILER_SECURE must be true or false.',
      );
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: secureValue ? secureValue === 'true' : port === 465,
      auth: { user, pass: password },
    });

    try {
      await transporter.sendMail({
        from,
        to: email,
        subject: 'Verify your UniSwap email',
        text: `Your verification token is:\n\n${token}\n\nThis token expires in 15 minutes.`,
      });
    } catch (error) {
      console.error('Error sending verification email:', error);
      throw new InternalServerErrorException(
        'Could not send verification email',
      );
    }
  }
}