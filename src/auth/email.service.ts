
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as geoip from 'geoip-lite';

@Injectable()
export class EmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail', // Or use SMTP settings
            auth: {
                user: 'mdfariyad177@gmail.com',
                pass: 'nlai jcsg pkvv xckh',
            },
        });
    }

    async sendLoginNotification(email: string, ip: string) {

        const geo = geoip.lookup(ip);
        const location = geo ? `${geo.city}, ${geo.country}` : 'Unknown Location';

        const mailOptions = {
            from: 'mdfariyad177@gmail.com',
            to: email,
            subject: 'Login Alert',
            text: `You have logged in from the following location:\n\nLocation: ${location}\nIP Address: ${ip}\n\nIf this wasn't you, please secure your account.`,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Login email sent to ${email}`);
        } catch (error) {
            console.error('Error sending email:', error);
        }
    }
}
