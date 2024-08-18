<template>
    <div style="width: 80vw; margin: auto;">
        <div style="
	        position: fixed;
          top: 10px;
          left: 10px;
        ">
            <el-button @click="dialogVisible = true" icon="el-icon-switch-button" circle
              style="
                border: none;
                font-size: 24px;
              "
            ></el-button>
        </div>
        <div style="height: calc(50vh - 212px)" />
        <div>
            <el-image :src="logo" fit="contain" style="width: 60vw"/>
        </div>
        <p>Bienvenido a PCI Android, aquí podrás determinar el valor del PCI de todas las unidades de muestra de tu proyeco mediante el ingreso de datos como el metrado, severidad y tipo de daño.</p>
      <el-dialog
        :visible.sync="dialogVisible"
        width="80%"
        style="margin-top: 20vh;"
      >
        <span>¿Cerrar sesión?</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">No</el-button>
          <el-button type="primary" @click="logout()">Sí</el-button>
        </span>
      </el-dialog>
      <Navbar/>
    </div>
</template>
<script>
import Navbar from '../components/Navbar.vue';
import { auth } from "../assets/mixins/auth.js"; 
export default {
  components: {
    Navbar
  },
  mixins: [auth],	
  data() {
    return {
	    logo: require('../assets/images/logo.png'),
      dialogVisible: false
    }
  },
  mounted() {
    console.log('Home');
  },
  methods: {
    logout() {
      fetch(this.authBaseUrl()+'/api/logout', {
          method: 'GET',
          headers: this.authHeaders()
      })
          .then(resp => resp.json()) 
          .then(data => {
            console.log('logout');
            console.dir(data)
            localStorage.removeItem("api_token");
            this.$router.push('/login');
          });
    }
  }
}
</script>