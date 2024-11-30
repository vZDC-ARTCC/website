import nodemailer from 'nodemailer';

const trap = require('nodemailer-trap-plugin').trap;

const SMTP_HOST = process.env.AWS_SMTP_HOST;
const SMTP_PORT = process.env.AWS_SMTP_PORT as unknown as number;
const SMTP_USER = process.env.AWS_SMTP_USERNAME;
const SMTP_PASS = process.env.AWS_SMTP_PASSWORD;

export const mailTransport = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
    },
});

mailTransport.use('compile', trap({
    to: 'beabravedude@gmail.com',
}))

export const FROM_EMAIL = process.env.AWS_SMTP_FROM;