<template>

  <el-container>
    <el-container>
      <el-main>
        <el-form ref="form" label-width="150px" style="width: 400px">

          <el-form-item label="监控集群" label-width="200px">
            <el-input v-model="addresses"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="serverTree">开启监控</el-button>
          </el-form-item>

        </el-form>
      </el-main>
    </el-container>
  </el-container>


</template>

<script>

export default {
  name: "home",
  data() {
    return {
      addresses: ""
    }
  },
  methods: {
    // 页面跳转
    serverTree() {
      this.$router.push({
        path: `/nodesView`,
        query: {
          addresses: this.addresses
        }
      })
    }
  },
  created() {
    console.log("首页输入地址")
  }
}
</script>

<style scoped>

</style>