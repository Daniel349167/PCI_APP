<template>
    <div style="width: 80vw; margin: auto; margin-top: 80px;">
        <div>
            <el-image :src="logo" fit="contain" style="width: 60vw"/>
        </div>
        <br>
        <p>¡Bienvenido a PCI Android!</p>
        <p>Por favor, ingrese su correo electrónico y contraseña. Si aún no tiene una cuenta, regístrese para crear una.</p>
        <br>
        <div>
            <label for="email" class="input-label">Correo</label>
            <el-input v-model="form.email" id="email"/>
        </div>
        <br>
        <div>
            <label for="password" class="input-label">Contraseña</label>
            <el-input v-model="form.password" id="password" show-password/>
        </div>
        <br>
        <div>
            <el-button type="primary" @click="login()">Iniciar Sesión</el-button>
        </div>
        <br>
        <div>
            <el-button @click="goto('signup')">Crear Cuenta</el-button>
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
        console.log('Login');
    },
    methods: {
        goto(route) {
            this.$router.push(route);
        },
        login() {
            var loading = this.$loading();
            fetch(this.authBaseUrl()+'/api/login', {
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
                        localStorage.api_token = data.token;
                        this.goto('home');
                    } else
                        this.$message({
                            showClose: true,
                            message: 'Datos incorrectos',
                            type: 'error',
                            center: true,
                            customClass: 'message'
                        });
                    loading.close();
                })
                .catch(error => {
                    this.$message({
                        showClose: true,
                        message: 'Ocurrió un error',
                        type: 'error',
                        center: true,
                        customClass: 'message'
                    });
                    loading.close();
                });
        }
    }
}
</script>
