'use server';

export const getOperatingInitials = async (firstName: string, lastName: string, otherInitials: string[]): Promise<string> => {
    let initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

    while (otherInitials.includes(initials)) {
        initials = generateRandomInitials();
    }

    return initials;
}

const generateRandomInitials = (): string => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    for (let i = 0; i < 2; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}