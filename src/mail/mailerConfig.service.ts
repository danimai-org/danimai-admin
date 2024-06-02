import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import * as path from 'path';

@Injectable()
export class MailerConfigClass implements MailerOptionsFactory {
  createMailerOptions(): MailerOptions {
    return {
      transport: {
        host: process.env.MAIL_HOST,
        port: +process.env.MAIL_PORT,
        ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true',
        secure: process.env.MAIL_SECURE === 'true',
        requireTLS: process.env.MAIL_REQUIRE_TLS === 'true',
        auth: {
          user: process.env.MAIL_USER,
          pass: process.env.MAIL_PASSWORD,
        },
      },
      defaults: {
        from: `"${process.env.MAIL_DEFAILT_EMAIL}" <${process.env.MAIL_DEFAILT_EMAIL}>`,
      },
      template: {
        dir: path.join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    };
  }
}
