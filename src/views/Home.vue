<template>
    <div style="width: 80vw; margin: auto">
        <div>
            <el-image :src="logo" fit="contain" style="width: 60vw"/>
        </div>
        <br>
        <p>Bienvenido a PCI Android, aquì podras determinar el valor del PCI de todas las unidades de muestra de tu proyeco mediante el ingreso de datos como el metrado,severidad y tipo de daño.</p>
    </div>
</template>
<script>
export default {
  data() {
    return {
	    logo: require('../assets/images/logo.png')
    }
  },
  mounted() {
    console.log('Home');
  }
}
</script>