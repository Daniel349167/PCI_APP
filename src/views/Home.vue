<template>
  <div style="width: 80vw; margin: auto;">
    <div style="position: fixed; top: 10px; left: 10px;">
      <el-button
        @click="dialogVisible = true"
        icon="el-icon-switch-button"
        circle
        style="border: none; font-size: 24px;"
      ></el-button>
    </div>
    <div style="height: calc(50vh - 212px)" />
    <div>
      <el-image :src="logo" fit="contain" style="width: 60vw" />
    </div>
    <p>
      Bienvenido a PCI Android, aquí podrás determinar el valor del PCI de todas
      las unidades de muestra de tu proyecto mediante el ingreso de datos como
      el metrado, severidad y tipo de daño.
    </p>
    <el-button
      @click="syncWithCloud"
      type="primary"
      style="margin-top: 10px;"
      icon="el-icon-refresh"
    >
      Sincronizar con la Nube
    </el-button>

    <!-- Modal de Cerrar Sesión -->
    <el-dialog
      title="Confirmar Cierre de Sesión"
      :visible.sync="dialogVisible"
      width="90%"
      center
    >
      <div style="text-align: center; padding: 20px;">
        <el-icon style="font-size: 48px; color: #E74C3C;">
          <i class="el-icon-warning"></i>
        </el-icon>
        <p
          style="font-size: 18px; font-weight: bold; margin-top: 10px; color: #333;"
        >
          ¿Estás seguro que deseas<br />cerrar sesión?
        </p>
        <p style="font-size: 14px; color: #666; margin-top: 5px;">
          Perderás el acceso a tu cuenta y deberás volver a iniciar sesión.
        </p>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
        style="text-align: center; padding: 10px;"
      >
        <el-button @click="dialogVisible = false" style="width: 90px;"
          >No</el-button
        >
        <el-button
          type="primary"
          @click="logout"
          style="
            width: 150px;
            background-color: #E74C3C;
            border-color: #E74C3C;
            color: white;
          "
          >Sí, cerrar sesión</el-button
        >
      </span>
    </el-dialog>

    <Navbar />
  </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';
import { auth } from '../assets/mixins/auth.js';
import { sqlite } from '../assets/mixins/sqlite.js';

export default {
  components: {
    Navbar,
  },
  mixins: [auth, sqlite],
  data() {
    return {
      logo: require('../assets/images/logo.png'),
      dialogVisible: false,
    };
  },
  methods: {
    logout() {
      console.log('Cerrando sesión...');
      localStorage.removeItem('api_token');

      if (window.plugins && window.plugins.googleplus) {
        window.plugins.googleplus.logout(
          () => {
            console.log('Sesión de Google cerrada.');
            this.$router.push('/login');
            this.$message({
              showClose: true,
              message: 'Sesión cerrada exitosamente.',
              type: 'success',
              center: true,
              customClass: 'message',
            });
          },
          (error) => {
            console.error('Error al cerrar sesión de Google:', error);
            this.$router.push('/login');
            this.$message({
              showClose: true,
              message:
                'Sesión cerrada, pero ocurrió un error al cerrar sesión de Google.',
              type: 'warning',
              center: true,
              customClass: 'message',
            });
          }
        );
      } else {
        console.warn('Plugin GooglePlus no está disponible.');
        this.$router.push('/login');
        this.$message({
          showClose: true,
          message: 'Sesión cerrada exitosamente.',
          type: 'success',
          center: true,
          customClass: 'message',
        });
      }
    },
    showSqliteData() {
      this.sqliteListTables(); // Método que prueba y muestra la información de SQLite
    },
    syncWithCloud() {
      // Tu lógica para sincronizar con la nube
    },
  },
};
</script>

<style scoped>
/* Estilos personalizados si los tienes */
</style>
