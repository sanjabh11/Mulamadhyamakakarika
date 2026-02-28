const isDev = process.env.NODE_ENV === 'development';

export const logger = {
    log: isDev ? console.log.bind(console) : () => { },
    warn: isDev ? console.warn.bind(console) : () => { },
    error: console.error.bind(console), // Always log errors
    group: isDev ? console.group.bind(console) : () => { },
    groupEnd: isDev ? console.groupEnd.bind(console) : () => { },
};
