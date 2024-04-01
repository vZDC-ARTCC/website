'use server';

export const validateCaptcha = async (token: string) => {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `secret=${process.env.GOOGLE_CAPTCHA_SECRET_KEY}&response=${token}`,
    });

    const data = await response.json();
    return {
        success: data.success,
        score: data.score,
    };
}