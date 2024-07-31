<template>
    <div style="width: 80vw; margin: auto">
		<div>
			<el-image :src="logo" fit="contain" style="width: 60vw"/>
		</div>
        <br>
        <div>
            <label for="email" class="input-label">Nombre</label>
            <el-input v-model="form.name" id="name"/>
        </div>
        <br>
        <div>
            <label for="email" class="input-label">Correo</label>
            <el-input v-model="form.email" id="email"/>
        </div>
        <br>
        <div>
            <label for="password" class="input-label">Contraseña</label>
            <el-input v-model="form.password" id="password" type="password"/>
        </div>
        <br>
        <div>
            <label for="confirm" class="input-label">Confirmar contraseña</label>
            <el-input v-model="form.password_confirmation" id="confirm" type="password"/>
        </div>
        <br>
        <div>
            <el-button type="primary" @click="register()">Crear una cuenta</el-button>
        </div>
        <br>
        <div>
            <el-button @click="goto('login')">Iniciar sesión</el-button>
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
                name: '',
                email: '',
                password: '',
                password_confirmation: ''
            }
    }
    },
    mounted() {
        console.log('Signup');
    },
    methods: {
        goto(route) {
            this.$router.push(route);
        },
        register() {
            var loading = this.$loading();
            fetch(this.authBaseUrl()+'/api/register', {
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
                        this.$message({
                            showClose: true,
                            message: 'Usuario creado',
                            type: 'success',
                            center: true,
                            customClass: 'message'
                        });
                        this.goto('login');
                    } else
                        this.$message({
                            showClose: true,
                            message: 'Datos incompatibles',
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