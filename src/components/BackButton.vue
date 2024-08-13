<template>
  <div style="
    text-align: left;
    margin-left: -10px;
    margin-bottom: -10px;
  ">
    <el-button @click="back()" icon="el-icon-back" circle
      style="
        border: none;
        font-size: 24px;
      "
    ></el-button>
  </div>
</template>
<script>
export default {
  name: 'BackButton',
  methods: {
    back() {
      this.$router.go(-1);
    }
  }
}
</script>