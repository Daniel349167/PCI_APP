<template>
    <div style="width: 80vw; margin: auto; margin-top: 60px;">
        <div>
            <el-image :src="logo" fit="contain" style="width: 60vw" />
        </div>
        <br>
        <p>¡Bienvenido a PCI Android!</p>
        <p>Por favor, ingrese su correo electrónico y contraseña. Si aún no tiene una cuenta, regístrese para crear una.
        </p>
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
            <el-button type="primary" @click="login()">Iniciar Sesión</el-button>
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
    methods: {
        goto(route) {
            this.$router.push(route);
        },
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
        login() {
            if (!this.validateForm()) return;

            var loading = this.$loading();
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
                    if (data.status) {
                        // Almacenando el token con NativeStorage
                        NativeStorage.setItem('api_token', data.token, () => {
                            this.goto('home');  // Redirigir al Home
                        }, error => {
                            console.error('Error al guardar el token:', error);
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            message: 'Datos incorrectos',
                            type: 'error',
                            center: true,
                            customClass: 'message'
                        });
                    }
                    loading.close();
                })
                .catch(error => {
                    this.$message({
                        showClose: true,
                        message: 'Ocurrió un error en el servidor',
                        type: 'error',
                        center: true,
                        customClass: 'message'
                    });
                    loading.close();
                });
        },
        loginWithGoogle() {
            window.plugins.googleplus.login(
                {
                    'webClientId': '720460114712-uf9c68cnthhilqntqn75hc24gnt24i4r.apps.googleusercontent.com',
                    'offline': true, // Habilita el acceso a un token de actualización
                },
                (obj) => {
                    console.log("Usuario autenticado:", obj);
                    // Enviar el idToken al backend para verificar
                    fetch(`${this.authBaseUrl()}/api/auth/google/callback?idToken=${obj.idToken}`, {
                        method: 'GET',  // Usar GET y pasar el token como parámetro de URL
                        headers: {
                            "Accept": "application/json",
                        }
                    })
                    .then(response => response.json())
                    .then(data => {
                        if (data.token) {
                            NativeStorage.setItem('api_token', data.token, () => {
                                this.goto('home');  // Redirigir al Home
                            }, (error) => {
                                console.error('Error al guardar el token:', error);
                            });
                        } else {
                            console.error("Error en la autenticación:", data);
                        }
                    })
                    .catch(error => {
                        console.error("Error en el proceso de autenticación:", error);
                    });

                },
                (msg) => {
                    this.$message({
                        showClose: true,
                        message: 'Error al autenticar con Google: ' + msg,
                        type: 'error',
                        center: true,
                        customClass: 'message'
                    });
                    console.error("Error al autenticar:", msg);
                }
            );
        }

    }
}
</script>
