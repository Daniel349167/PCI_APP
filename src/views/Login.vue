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
			<div style="text-align: left">Correo</div>
            <el-input v-model="email" label="email"/>
        </div>
        <br>
        <div>
			<div style="text-align: left">Contraseña</div>
            <el-input v-model="password" />
        </div>
        <br>
        <div>
            <el-button>Iniciar Sesión</el-button>
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
  }
}
</script>
