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

export const getDuration = (start: Date, end: Date) => {
    const diff = end.getTime() - start.getTime();
    const difference = new Date(diff);

    const timeSplit = difference.toISOString().split("T");

    const sessionTime = timeSplit[1].split(":")[0]+":"+timeSplit[1].split(":")[1]
    // const hours = Math.floor(diff / 1000 / 60 / 60);
    // const minutes = Math.floor(diff / 1000 / 60 % 60);
    return `${sessionTime}`;
}

export const formatZuluDate = (date: Date) => {
    const d = new Date(date);
    let month = '' + (d.getUTCMonth() + 1);
    let day = '' + d.getUTCDate();
    let year = d.getUTCFullYear().toString().substr(-2);
    let hour = '' + d.getUTCHours();
    let minute = '' + d.getUTCMinutes();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    if (hour.length < 2) hour = '0' + hour;
    if (minute.length < 2) minute = '0' + minute;

    return [month, day, year].join('/') + ' ' + [hour, minute].join('') + 'z';
};