<template>
  <div v-loading.fullscreen.lock="downloading">
    <BackButton/>
		<div class="page-title">
			Resumen de PCI de {{ project_name }}
		</div>
    <table id="table" class="summary-table pci-table"></table>
    <div class="float">
        <el-button @click="downloadPDF" icon="el-icon-download" circle></el-button>
    </div>
    <Navbar/>
  </div>
</template>
<script>
import Navbar from '../components/Navbar.vue';
import BackButton from '../components/BackButton.vue';
import { auth } from "../assets/mixins/auth.js"; 
import { pdfmixin } from '../assets/mixins/pdf.js';
export default {
    components: {
        Navbar,
        BackButton
    },
    mixins: [auth,pdfmixin],	
    data() {
        return {
            image_not_found: require('../assets/images/not_found.png'),
            project_name: '\xa0',
            loading: true,
            sample: {},
            summary: [{}],
            downloading: false
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
                    this.createTable();
                });
        },
        createTable() {
          var data = [
            { label: 'UM', key: 'UM'},
            { label: 'Del', key: 'Del'},
            { label: 'Al', key: 'Al'},
            { label: 'PCI', key: 'PCI'},
            { label: 'Condición', key: 'Condición'},
          ]
          var table = document.getElementById('table');
          var head = document.createElement('tr');
          
          for(var elem of data) {
            var th = document.createElement('th');
            th.appendChild(document.createTextNode(elem.label));
            head.appendChild(th);
          }
          table.appendChild(head);

          for(var row of this.summary) {
            var tr = document.createElement('tr');
            for(var elem of data) {
              var td = document.createElement('td');
              td.appendChild(document.createTextNode(row[elem.key]));
              if(elem.key=='Condición')
                td.style.backgroundColor = {
                  'Excelente': '#28B45E',
                  'Muy bueno': '#79C142',
                  'Bueno': '#EBE723',
                  'Regular': '#EE2E2E',
                  'Pobre': '#C22026',
                  'Muy pobre': '#7A1315',
                  'Fallado': '#D9D9D9'
                }[row['Condición']];
              tr.appendChild(td);
            }
            tr.style.backgroundColor = '#2C39A982'
            table.appendChild(tr);
          }
          console.log(table.outerHTML);
        },
        async downloadPDF(){
          this.downloading = true;
          await this.downloadPDFPCI(this.summary, this.project_name);
          this.downloading = false;
          this.$message({
              showClose: true,
              message: 'Archivo descargado',
              type: 'success',
              center: true,
              customClass: 'message'
          });
        }
    }
}
</script>
<style>
.float {
    position: fixed;
    bottom: 80px;
    right: 20px;
}
.float .el-button {
    border-color: #2C39A994;
    border-width: 3px;
    color: #2C39A994;
    font-size: 24px;
}
.blue-card .el-card__body  {
    background-color: #2C39A994;
}
</style>