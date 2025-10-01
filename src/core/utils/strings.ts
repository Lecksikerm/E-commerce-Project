export const generateRandomToken = (
    length = 25,
    characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
): string => {
    let token = '';
    for (let i = 0; i < length; i++) {
        token += characters[Math.floor(Math.random() * characters.length)];
    }

    return token;
};

export const generateRandomOTP = (length = 6): string => {
    return Math.random()
        .toString()
        .slice(2, length + 2);
};

export const toTitleCase = (str: string): string => {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
};

export const convertSnakeToTitleCase = (str: string): string => {
    return str
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
};

export function isValidUUID(uuid: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}