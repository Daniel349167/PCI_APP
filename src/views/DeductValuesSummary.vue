<template>
  <div>
    <BackButton/>
		<div class="page-title">
			Resumen de Metrado de UM {{ sample.number }}
		</div>
    <el-table
      :data="summary"
      border
      style="width: 100%; margin-top: 20px;"
      size="mini"
    >
      <el-table-column
        prop="Daño"
        label="Daño"
        align="center"
        width="60"
      ></el-table-column>
      <el-table-column
        prop="Severidad"
        label="Severidad"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="Total"
        label="Total"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="Densidad"
        label="Densidad"
        align="center"
      ></el-table-column>
      <el-table-column
        prop="VD"
        label="VD"
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
            loading: true,
            sample: {},
            summary: [{}]
        }
    },
    mounted() {
        console.log('DeductValuesSummaries');
        this.loadSample();
        this.loadSummary();
    },
    methods: {
        loadSample() {
            fetch(this.authBaseUrl()+'/api/samples/' + this.$route.params.sample, {
                method: 'GET',
                headers: this.authHeaders()
            })
                .then(resp => resp.json()) 
                .then(data => {
                    this.sample = data;
                });
        },
        loadSummary() {
            fetch(`${this.authBaseUrl()}/api/deducted-values/${this.$route.params.project}/${this.$route.params.sample}`, {
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