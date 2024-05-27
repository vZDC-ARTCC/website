import {toast} from "react-toastify";
import {validateCaptcha} from "@/actions/captcha";

export const checkCaptcha = async (token?: string) => {
    if (!token) {
        toast('Recaptcha validation failed', {type: 'error'});
        return;
    }
    const captchaResult = await validateCaptcha(token);

    if (!captchaResult.success) {
        toast('Recaptcha validation failed', {type: 'error'});
        return;
    }

    if (captchaResult.score < 0.7) {
        toast('Recaptcha validation failed', {type: 'error'});
        return;
    }
}