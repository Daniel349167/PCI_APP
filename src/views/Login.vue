<template>
    <div>
        <div>
            Login
        </div>
        <br>
        <div>
            <el-input v-model="form" />
        </div>
        <br>
        <div>
            <el-button>Botón</el-button>
        </div>
    </div>
</template>
<script>
export default {
  data() {
    return {
      form: ''
    }
  },
  mounted() {
    console.log('Login');
  }
}
</script>
