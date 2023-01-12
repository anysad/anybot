declare global {
    namespace NodeJS {
        interface ProcessEnv {
            FUN_API_KEY: string;
            MONGOOSE_CONNECTION_STRING: string;
            DISCORD_API: string;
        }
    }
}

export {}