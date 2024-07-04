<script>

import PCILogo from '@/assets/images/logo.png';
</script>
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
  }
}
</script>
