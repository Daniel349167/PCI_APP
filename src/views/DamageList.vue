<template>
    <div style="width: 90vw; margin: auto">
        <BackButton/>
		<div class="page-title">
			Inventario de fallas
		</div>
        <div style="height: 20px" />
        <table>
            <tr>
                <td style="width: 100px; text-align: right;">
                    Proyecto:
                </td>
                <td style="text-align: left">
                    {{sample.project}}
                </td>
            </tr>
            <tr>
                <td style="text-align: right;">
                    UM:
                </td>
                <td style="text-align: left">
                    UM {{sample.number}}
                </td>
            </tr>
            <tr>
                <td style="text-align: right;">
                    Del:
                </td>
                <td style="text-align: left">
                    {{sample.from_km}} km + {{sample.from_m}} m
                </td>
            </tr>
            <tr>
                <td style="text-align: right;">
                    Al:
                </td>
                <td style="text-align: left">
                    {{sample.to_km}} km + {{sample.to_m}} m
                </td>
            </tr>
        </table>
        <div style="height: 20px" />
        <el-carousel v-loading="!damages.length" indicator-position="outside" arrow="always" height="350px" :autoplay="false" ref="car">
            <el-carousel-item v-for="damage in damages" :key="damage.id">
                <el-image v-if="damage.image" :src="damage.image" fit="contain" style="height: 200px"/>
                <div v-else v-loading="true" style="height: 200px"/>
                <el-table
                    :data="[damage]"
                    border
                    style="width: 100%">
                    <el-table-column
                        prop="type"
                        label="Daño"
                        width="90"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="severity"
                        label="Severidad"
                        align="center"
                    >
                    </el-table-column>
                    <el-table-column
                        prop="amount"
                        label="Cantidad"
                        width="90"
                        align="center"
                    >
                    </el-table-column>
                </el-table>
            </el-carousel-item>
        </el-carousel>
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
            damages: [],
            sample: {}
        }
    },
    mounted() {
        console.log('DamageList');
        this.loadSample();
        this.loadDamages();
    },
    methods: {
        
        loadDamages() {
            this.damages = [];
            fetch(`${this.authBaseUrl()}/api/samples/${this.$route.params.sample}/damages`, {
                method: 'GET',
                headers: this.authHeaders()
            })
                .then(resp => resp.json()) 
                .then(data => {
                    this.damages = data;
                    let map = ['', 'L', 'M', 'H'];
                    for (let damage of this.damages) {
                        damage.severity = map[damage.severity];
                        damage.image = null;
                    }
                    this.loadImages();
                }); 
        },
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
        async loadImages() {
            for(var damage of this.damages) {
                await fetch(`${this.authBaseUrl()}/api/damages/${damage.id}/image`, {
                    method: 'GET',
                    headers: this.authHeaders(),
                })
                    .then(resp => resp.json()) 
                    .then(data => {
                        if(data.image)
                            damage.image = data.image;
                        else
                            damage.image = this.image_not_found;
                        damage.id = damage.id++; // Update carousel element
                    });
            }
        }
    }
}
</script>