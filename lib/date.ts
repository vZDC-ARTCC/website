export const getDaysLeft = (date: Date): string => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `Expires in ${days} days`;
}

export const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
        return `${seconds} second(s) ago`;
    } else if (minutes < 60) {
        return `${minutes} minute(s) ago`;
    } else if (hours < 24) {
        return `${hours} hour(s) ago`;
    } else {
        return `${days} day(s) ago`;
    }
}

export const getMonth = (month: number) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month];
}