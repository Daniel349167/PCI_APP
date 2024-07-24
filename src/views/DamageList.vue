<template>
    <div style="width: 90vw; margin: auto">
		<div class="page-title">
			Inventario de fallas
		</div>
        <div style="height: 20px" />
        <table>
            <tr>
                <td style="width: 20%; text-align: right;">
                    Proyecto:
                </td>
                <td style="text-align: left">
                    Proyecto 1
                </td>
            </tr>
            <tr>
                <td style="width: 30%; text-align: right;">
                    UM:
                </td>
                <td style="text-align: left">
                    UM 1
                </td>
            </tr>
            <tr>
                <td style="width: 30%; text-align: right;">
                    Del:
                </td>
                <td style="text-align: left">
                    _
                </td>
            </tr>
            <tr>
                <td style="width: 30%; text-align: right;">
                    Al:
                </td>
                <td style="text-align: left">
                    _
                </td>
            </tr>
        </table>
        <div style="height: 20px" />
        <el-image :src="image_not_found" fit="contain"/>
        <div style="height: 20px" />
        <el-table
            :data="surveys"
            border
            style="width: 100%">
            <el-table-column
                prop="damage"
                label="Daño"
                width="100">
            </el-table-column>
            <el-table-column
                prop="severity"
                label="Severidad"
                width="120">
            </el-table-column>
            <el-table-column
                prop="ammount"
                label="Cantidad">
            </el-table-column>
        </el-table>
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
            surveys: []
        }
    },
    mounted() {
        console.log('DamageList');
        this.loadSurveys();
    },
    methods: {
        
    loadSurveys() {
        this.surveys = [];
        fetch(this.authBaseUrl()+'/api/surveys/' + this.$route.params.sample, {
            method: 'GET',
            headers: this.authHeaders()
        })
            .then(resp => resp.json()) 
            .then(data => {
                console.dir(data);
                this.loading = false;
                for(var survey of data) {
                    this.surveys.push({
                        damage: survey.number,
                        severity: 'L',
                        ammount: 1
                    });
                }
            }); 
        }
    }
}
</script>