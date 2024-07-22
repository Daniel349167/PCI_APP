export const auth = {
    methods: {
        authBaseUrl() {
            return 'https://10.0.2.2:8000'
            return 'http://127.0.0.1:8000'
        },
        authHeaders() {
            var token = localStorage.api_token;
            return {
                "Content-Type": "application/json;charset=UTF-8",
                Accept: "application/json",
                Authorization: `Bearer ${token}`
            }
        }
    }
}