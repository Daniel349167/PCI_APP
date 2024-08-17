export const auth = {
    methods: {
        authBaseUrl() {
            return 'https://quiet-oasis-06857-7db50e92e151.herokuapp.com'
            // return 'http://192.168.1.57:8000'
            // return 'http://10.0.2.2:8000'
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