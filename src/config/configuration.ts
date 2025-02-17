console.log("PORT from env:", process.env.PORT);

export default () => ({

    port: parseInt(process.env.PORT || '3000', 10),

    database: {
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        user: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        name: process.env.DATABASE_NAME,
    },
    jwt: {
        secret: process.env.JWT_SECRET,
    },

    auth: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callBackUrl: process.env.GOOGLE_CALLBACK_URL

        },
        microsoft: {
            clientId: process.env.MICROSOFT_CLIENT_ID,
            clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
            callBackUrl: process.env.MICROSOFT_CALLBACK_URL
        },
        frontendRedirect: process.env.FRONTEND_REDIRECT_URL,

    },


});
