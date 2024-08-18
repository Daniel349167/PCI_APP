<template>
  <div>
    <BackButton/>
		<div class="page-title">
			Resumen de Metrado de UM {{ sample.number }}
		</div>
    <table id="table" class="summary-table"></table>
		<Navbar :resultId="$route.params.project"/>
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
        console.log('MeteringSummary');
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
            fetch(`${this.authBaseUrl()}/api/damage-measurement/${this.$route.params.project}/${this.$route.params.sample}`, {
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
            { label: 'N°', key: 'id' },
            { label: 'Tipo falla', key: 'tipo_falla' },
            { label: 'Unidad', key: 'unidad' },
            { label: 'Severidad', key: 'severidad' },
            { label: 'Metrado', key: 'metrado' },
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
              tr.appendChild(td);
            }
            table.appendChild(tr);
          }

        }
    }
}
</script>