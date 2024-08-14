<template>
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
    if(localStorage.api_token)
      this.$router.push('home');
    else
      this.$router.push('login');
  }
}
</script>
