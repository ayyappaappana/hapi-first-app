'use strict';

module.exports = {
     server: {
        host: '127.0.0.1',
        port: 8000
    },
    database: {
        host: '127.0.0.1',
        port: 27017,
        db: 'sample',
        username: '',
        password: ''
    },
    key: {
        privateKey: '37LvDSm4XvjYOh9Y',
        tokenExpiry: 1 * 30 * 1000 * 60 //1 hour
    },
    publicFolder: './public',
    uploadFolder: '/uploads',
    MixFolder: './public/uploads',
    MixInsideFolder: './public/uploads/',
    email: {
        username: "mounica1331@gmail.com",
        password: "ksnc1331",
        accountName: "mounica1331",
        verifyEmailUrl: "verifyEmail"
    }
};
