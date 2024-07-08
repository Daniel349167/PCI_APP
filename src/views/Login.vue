<template>
    <div style="width: 80vw; margin: auto">
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
        // console.log(this.authBaseUrl())
        fetch('https://api.sampleapis.com/coffee/hot')
            .then(resp => resp.json()) 
            .then(data => console.log(data[0].title)); 
    },
    methods: {
        goto(route) {
            this.$router.push(route);
        },
        login() {
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
                        alert('Datos Incorrectos');
                }); 
        }
    }
}
</script>
