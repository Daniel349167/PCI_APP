<template>
    <div style="width: 90vw; margin: auto">
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
                    {{form.project}}
                </td>
            </tr>
            <tr>
                <td style="text-align: right;">
                    UM:
                </td>
                <td style="text-align: left">
                    UM {{form.sample}}
                </td>
            </tr>
            <tr>
                <td style="text-align: right;">
                    Del:
                </td>
                <td style="text-align: left">
                    {{form.from}}
                </td>
            </tr>
            <tr>
                <td style="text-align: right;">
                    Al:
                </td>
                <td style="text-align: left">
                    {{form.to}}
                </td>
            </tr>
        </table>
        <div style="height: 20px" />
        <el-carousel indicator-position="outside" arrow="always" height="350px" :autoplay="false">
            <el-carousel-item v-for="damage in damages" :key="damage.id">
                <el-image :src="image_not_found" fit="contain"/>
                <el-table
                :data="[damage]"
                border
                style="width: 100%">
                    <el-table-column
                        prop="damage"
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
                        prop="ammount"
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
import { auth } from "../assets/mixins/auth.js"; 
import Moment from 'moment';
export default {
    components: {
        Navbar
    },
    mixins: [auth],	
    data() {
        return {
            image_not_found: require('../assets/images/not_found.png'),
            loading: true,
            damages: [],
            form: {}
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
            fetch(this.authBaseUrl()+'/api/damages/' + this.$route.params.sample, {
                method: 'GET',
                headers: this.authHeaders()
            })
                .then(resp => resp.json()) 
                .then(data => {
                    console.dir(data);
                    this.loading = false;
                    for(var damage of data) {
                        this.damages.push({
                            id: damage.id,
                            damage: damage.number,
                            severity: 'L',
                            ammount: 1
                        });
                    }
                }); 
        },
        loadSample() {
            this.form = {
                project: 'Proyecto 1',
                sample: 1,
                from: '40km+30m',
                to: '40km+30m'
            }
        }
    }
}
</script>