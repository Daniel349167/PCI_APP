<template>
    <div style="width: 80vw; margin: auto">
		<div>
			<el-image :src="logo" fit="contain" style="width: 60vw"/>
		</div>
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
            <label for="confirm" class="input-label">Confirmar contraseña</label>
            <el-input v-model="password" id="confirm"/>
        </div>
        <br>
        <div>
            <el-button type="primary" @click="goto('home')">Crear una cuenta</el-button>
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
    console.log('Signup');
  },
  methods: {
    goto(route) {
      this.$router.push(route);
    }
  }
}
</script>