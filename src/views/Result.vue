<template>
    <div style="width: 90vw; margin: auto">
		<div class="page-title">
            Resultados<br />
			Proyecto {{ $route.params.result }}
		</div>
        <div style="height: 20px" />
        <el-button @click="goto('/damagelists/'+$route.params.result)">Inventario de fallas</el-button>
        <div style="height: 10px" />
        <el-button>Resumen de metrado daños por UM</el-button>
        <div style="height: 10px" />
        <el-button>Resumen de Valores Deducidos por UM</el-button>
        <div style="height: 10px" />
        <el-button>Resumen PCI por UM</el-button>
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
            form: {
                type: null
            },
            image_url: '',
            image: null
        }
    },
    created() {
        console.log('created');
        document.addEventListener("deviceready", function() {
            console.log('navigator');
            console.dir(navigator);
        }, false);
    },
    methods: {
        goto(route) {
            this.$router.push(route);
        }
    }
}
</script>