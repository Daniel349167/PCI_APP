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
            <el-input v-model="email" id="email"/>
        </div>
        <br>
        <div>
            <label for="password" class="input-label">Contraseña</label>
            <el-input v-model="password" id="password"/>
        </div>
        <br>
        <div>
            <el-button type="primary" @click="goto('home')">Iniciar Sesión</el-button>
        </div>
        <br>
        <div>
            <el-button @click="goto('signup')">Crear Cuenta</el-button>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            email: '',
            password: '',
            logo: require('../assets/images/logo.png')
        }
    },
    mounted() {
        console.log('Login');
        fetch('https://api.sampleapis.com/coffee/hot')
            .then(resp => resp.json()) 
            .then(data => console.log(data[0].title)); 
    },
    methods: {
        goto(route) {
            this.$router.push(route);
        }
    }
}
</script>
