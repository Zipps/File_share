module.exports = {
    name: 'EasySuiteTest@suncorp.com.au',
    props: {
        username: 'emailaddress@gmail.com',
        password: 'password',
        folder: 'INBOX'
    },
    alerts: {
        warning: {
            email: 'emailaddress@gmail.com',
            threshold: 600,
            lastWarning: null
        },
        critical: {
            email: 'escalationemail@notarealdomain.donkey',
            mobile: '0414472534',
            threshold: 6000,
            lastCritical: null
        }
    },
    active: true
};