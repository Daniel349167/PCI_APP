<template>
    <div style="width: 90vw; margin: auto">
        <BackButton/>
        <div class="page-title">
            Resultados<br />
            {{ project_name }}
        </div>
        <div style="height: 20px" />
        <el-button @click="goto('/damagelists/'+$route.params.project)">Inventario de fallas</el-button>
        <div style="height: 10px" />
        <el-button @click="goto(`/summaries/metering/${$route.params.project}`)">Resumen de metrado daños por UM</el-button>
        <div style="height: 10px" />
        <el-button @click="goto(`/summaries/deduct/${$route.params.project}`)">Resumen de Valores Deducidos por UM</el-button>
        <div style="height: 10px" />
        <el-button @click="goto(`/summaries/pci/${$route.params.project}`)">Resumen PCI por UM</el-button>
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
            form: {
                type: null
            },
            project_name: '\xa0',
            image_url: '',
            image: null
        }
    },
    created() {
        console.log('created');
        
        fetch(`${this.authBaseUrl()}/api/projects/${this.$route.params.project}`, {
            method: 'GET',
            headers: this.authHeaders()
        }).then(resp => resp.json()).then(data => this.project_name = data.name); 
    },
    methods: {
        goto(route) {
            this.$router.push(route);
        }
    }
}
</script>