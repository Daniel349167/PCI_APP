<template>
    <div style="width: 80vw; margin: auto">
		<div>
			<el-image :src="logo" fit="contain" style="width: 60vw"/>
		</div>
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
			<div style="text-align: left">Confirmar contraseña</div>
            <el-input v-model="password" />
        </div>
        <br>
        <div>
            <el-button>Crear una cuenta</el-button>
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
    console.log('Signin');
  }
}
</script>