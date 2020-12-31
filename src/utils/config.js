const config = {
    GoDataAPIConfig: {
        baseURL: 'http://localhost:8000/api',
        credentials: {
            email: 'test@who.int',
            password: '123412341234'
        }
    },
    DHIS2APIConfig: {
        baseURL: 'http://localhost:8080/api',
        credentials: {
            user: 'admin',
            password: 'district'
        }
    }
}

export default config