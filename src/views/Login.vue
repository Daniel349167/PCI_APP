<template>
    <div style="width: 80vw; margin: auto; margin-top: 60px;">
        <div>
            <el-image :src="logo" fit="contain" style="width: 60vw" />
        </div>
        <br>
        <p>¡Bienvenido a PCI Android!</p>
        <p>Por favor, ingrese su correo electrónico y contraseña. Si aún no tiene una cuenta, regístrese para crear una.</p>
        <br>
        <div>
            <label for="email" class="input-label">Correo</label>
            <el-input v-model="form.email" id="email" />
        </div>
        <br>
        <div>
            <label for="password" class="input-label">Contraseña</label>
            <el-input v-model="form.password" id="password" show-password />
        </div>
        <br>
        <div>
            <el-button type="primary" @click="login">Iniciar Sesión</el-button>
        </div>
        <br>
        <div>
            <el-button @click="goto('signup')">Crear Cuenta</el-button>
        </div>
        <br>
        <div style="display: flex; justify-content: center; align-items: center; margin-bottom: 20px; margin-top: 5px;">
            <hr style="width: 40%; border: none; border-top: 1px solid #ccc;">
            <span style="margin: 0 10px; color: #ccc;">o</span>
            <hr style="width: 40%; border: none; border-top: 1px solid #ccc;">
        </div>
        <!-- Botón para Continuar con Google -->
        <div style="text-align: center;">
            <el-button type="primary" @click="loginWithGoogle"
                style="background-color: #4285F4; color: white; width: 100%; max-width: 400px; display: flex; align-items: center; justify-content: center; padding: 10px 0; margin-bottom: 60px;">
                <img src="../assets/images/google-icon.png" alt="Google"
                    style="width: 20px; height: 20px; margin-right: 10px; vertical-align: middle;">
                <span style="line-height: 1;">Continuar con Google</span>
            </el-button>
        </div>
    </div>
</template>

<script>
import { auth } from "../assets/mixins/auth.js";

export default {
    mixins: [auth],
    data() {
        return {
            logo: require('../assets/images/logo.png'),
            form: {
                email: '',
                password: '',
            }
        }
    },
    mounted() {
        const token = localStorage.getItem('api_token');
        if (token) {
            this.validateToken(token);
        }
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    beforeDestroy() {
        document.removeEventListener('deviceready', this.onDeviceReady, false);
    },
    methods: {

        goto(route) {
            this.$router.push(route);
        },
        // Validar el formulario de inicio de sesión
        validateForm() {
            if (!this.form.email || !this.form.password) {
                this.$message({
                    showClose: true,
                    message: 'Por favor, complete todos los campos.',
                    type: 'warning',
                    center: true,
                    customClass: 'message'
                });
                return false;
            }
            return true;
        },
        // Método de inicio de sesión con email y contraseña
        login() {
            if (!this.validateForm()) return;

            const loading = this.$loading();
            fetch(this.authBaseUrl() + '/api/login', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    Accept: "application/json",
                },
                body: JSON.stringify(this.form)
            })
                .then(resp => resp.json())
                .then(data => {
                    loading.close();
                    if (data.status) {
                        localStorage.setItem('api_token', data.token);
                        this.goto('home');  // Redirigir al Home
                    } else {
                        this.$message({
                            showClose: true,
                            message: 'Datos incorrectos',
                            type: 'error',
                            center: true,
                            customClass: 'message'
                        });
                    }
                })
                .catch(error => {
                    loading.close();
                    console.error("Error en el inicio de sesión:", error);
                    this.$message({
                        showClose: true,
                        message: 'Ocurrió un error en el servidor',
                        type: 'error',
                        center: true,
                        customClass: 'message'
                    });
                });
        },
        // Método para iniciar sesión con Google
        loginWithGoogle() {
            const loading = this.$loading({
                lock: true,
                text: 'Autenticando...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            if (window.plugins && window.plugins.googleplus) {
                window.plugins.googleplus.login(
                    {
                        'webClientId': '720460114712-uf9c68cnthhilqntqn75hc24gnt24i4r.apps.googleusercontent.com',
                        'prompt': 'select_account',
                        // Establecemos 'offline' en false para evitar solicitar refresh_token
                        'offline': false,
                        'scopes': 'email profile' // Añadimos los scopes necesarios
                    },
                    (obj) => {
                        loading.close();
                        this.handleGoogleLogin(obj);
                    },
                    (msg) => {
                        loading.close();
                        console.error("Error al autenticar con Google:", msg);
                        this.$message({
                            showClose: true,
                            message: 'Error al autenticar con Google: ' + msg,
                            type: 'error',
                            center: true,
                            customClass: 'message'
                        });
                    }
                );
            } else {
                loading.close();
                console.error("Plugin GooglePlus no está disponible.");
                this.$message({
                    showClose: true,
                    message: 'GooglePlus plugin no está disponible.',
                    type: 'error',
                    center: true,
                    customClass: 'message'
                });
            }
        },
        // Manejar el inicio de sesión exitoso con Google
        handleGoogleLogin(obj) {
            const loading = this.$loading({
                lock: true,
                text: 'Autenticando...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            fetch(`${this.authBaseUrl()}/api/auth/google/callback?idToken=${obj.idToken}`, {
                method: 'GET',
                headers: {
                    "Accept": "application/json",
                }
            })
                .then(response => response.json())
                .then(data => {
                    loading.close();
                    if (data.token) {
                        localStorage.setItem('api_token', data.token);
                        this.goto('home');
                    } else {
                        console.error("Error en la autenticación:", data);
                        this.$message({
                            showClose: true,
                            message: 'Error en la autenticación con Google.',
                            type: 'error',
                            center: true,
                            customClass: 'message'
                        });
                    }
                })
                .catch(error => {
                    loading.close();
                    console.error("Error en el proceso de autenticación:", error);
                    this.$message({
                        showClose: true,
                        message: 'Error en el proceso de autenticación.',
                        type: 'error',
                        center: true,
                        customClass: 'message'
                    });
                });
        },
        // Método para cerrar sesión con Google
        handleGoogleLogout() {
            if (window.plugins && window.plugins.googleplus) {
                window.plugins.googleplus.logout(
                    () => {
                        this.clearLocalStorage();
                        this.goto('login');
                        this.$message({
                            showClose: true,
                            message: 'Sesión cerrada exitosamente.',
                            type: 'success',
                            center: true,
                            customClass: 'message'
                        });
                    },
                    (error) => {
                        console.error('Error al cerrar sesión:', error);
                        this.$message({
                            showClose: true,
                            message: 'Error al cerrar sesión con Google.',
                            type: 'error',
                            center: true,
                            customClass: 'message'
                        });
                    }
                );
            } else {
                console.error("Plugin GooglePlus no está disponible.");
                this.$message({
                    showClose: true,
                    message: 'GooglePlus plugin no está disponible.',
                    type: 'error',
                    center: true,
                    customClass: 'message'
                });
            }
        },
        // Método para limpiar el localStorage
        clearLocalStorage() {
            localStorage.removeItem('api_token');
        },
        // Validar el token almacenado en el localStorage
        validateToken(token) {
            const loading = this.$loading({
                lock: true,
                text: 'Validando sesión...',
                spinner: 'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
            });

            fetch(`${this.authBaseUrl()}/api/auth/validate`, {
                method: 'POST',
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Accept": "application/json"
                }
            })
                .then(response => response.json())
                .then(data => {
                    loading.close();
                    if (data.valid) {
                        this.goto('home');
                    } else {
                        this.clearLocalStorage();
                        // El usuario debe iniciar sesión manualmente
                    }
                })
                .catch(error => {
                    loading.close();
                    console.error("Error al validar el token:", error);
                    this.clearLocalStorage();
                    // No intentar un login silencioso automáticamente
                });
        }
    }
}
</script>

<style scoped>
.input-label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
}
</style>
