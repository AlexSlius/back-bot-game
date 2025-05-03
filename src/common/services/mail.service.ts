import nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

const transporter = nodemailer.createTransport({
    service: 'Brevo',
    auth: {
        user: process.env.MAIL_USER_EMAIL,
        pass: process.env.MAIL_USER_PASS,
    },
});

@Injectable()
export class SendEmail {
    async send({ email = '', isNew = false, password = '' }: { email: string, isNew?: boolean, password: string }) {
        await transporter.sendMail({
            from: `"СРМ МГ" <${process.env.MAIN_FORM}>`,
            to: email,
            subject: isNew ? 'Ласкаво просимо! Ваш пароль' : 'Ваш пароль',
            html: this.htmlText(isNew, password)
        });
    }

    htmlText(isNew: Boolean, password: string) {
        return `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
            <h2 style="color: #3858e9;">${isNew ? "Вітаємо у нашій системі!" : "Підтримка СРМ МГ"}</h2>
            <p>${isNew ? "Дякуємо за реєстрацію." : ""}</p>
            <p><strong>Ваш ${isNew ? "" : "новий"} пароль для входу:</strong></p>
            <div style="background-color: #f0f0f0; padding: 10px; border-radius: 5px; display: inline-block;">
                <strong>${password}</strong>
            </div>
            <p>Будь ласка, збережіть його у безпечному місці.</p>
            <br/>
            <p>З найкращими побажаннями,<br/>Команда підтримки</p>
        </div>
    `
    }
}