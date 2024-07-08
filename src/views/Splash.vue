<template>
    <div>
        <el-image :src="logo" fit="contain" style="width: 80vw; height: 80vh"/>
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
    console.log('Splash');
    setTimeout(() => {
      if(localStorage.api_token)
        this.$router.push('home');
      else
        this.$router.push('login');
    }, 2000);
  }
}
</script>
