export interface ServiceRoute {
    target: string;
    paths: string[];
}

export const ROUTES: ServiceRoute[] = [
    {
        target: process.env.AUTH_URL,
        paths: ['auth', 'users'],
    },
    {
        target: process.env.EVENT_URL,
        paths: ['events'],
    },
];