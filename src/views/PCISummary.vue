<template>
  <div>
    <BackButton/>
		<div class="page-title">
			Resumen de PCI de {{ project_name }}
		</div>
    <el-table
      :data="summary"
      border
      style="width: 100%; margin-top: 20px;"
      size="mini"
    >
      <el-table-column
        prop="UM"
        label="UM"
        align="center"
        width="60"
      ></el-table-column>
      <el-table-column
        prop="Del"
        label="Del"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="Al"
        label="Al"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="PCI"
        label="Densidad"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="Condición"
        label="Condición"
        align="center"
      ></el-table-column>
    </el-table>
    <Navbar/>
  </div>
</template>
<script>
import Navbar from '../components/Navbar.vue';
import BackButton from '../components/BackButton.vue';
import { auth } from "../assets/mixins/auth.js"; 
export default {
    components: {
        Navbar,
        BackButton
    },
    mixins: [auth],	
    data() {
        return {
            image_not_found: require('../assets/images/not_found.png'),
            project_name: '\xa0',
            loading: true,
            sample: {},
            summary: [{}]
        }
    },
    mounted() {
        console.log('PCISummary');
        this.loadSummary();
        fetch(`${this.authBaseUrl()}/api/projects/${this.$route.params.project}`, {
            method: 'GET',
            headers: this.authHeaders()
        }).then(resp => resp.json()).then(data => this.project_name = data.name); 
    },
    methods: {
        loadSummary() {
            fetch(`${this.authBaseUrl()}/api/calculate-pci/${this.$route.params.project}`, {
                method: 'GET',
                headers: this.authHeaders()
            })
                .then(resp => resp.json()) 
                .then(data => {
                    this.summary = data;
                });
        }
    }
}
</script>