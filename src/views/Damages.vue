<template>
    <div style="width: 90vw; margin: auto">
        <BackButton/>
		<div class="page-title">
			HOJA DE RELEVAMIENTO
		</div>
		<div class="page-title">
			UM {{ sample.number }}
		</div>
        <table style="margin: 0px auto">
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
        <div v-if="loading" v-loading="true" style="height: 160px" />
        <div v-for="damage in damages" :key="damage.id" style="margin: 20px 0px" class="blue-card"
            @click="delete_mode ? (delete_damage_id = damage.id) : goto('/damages/'+damage.id)"
        >
            <el-card :class="delete_mode ? 'delete-card' : ''">
                <el-row>
                    <el-col :span="8">
                        <el-image :src="damage.image" fit="contain"/>
                    </el-col>
                    <el-col :span="16" style="text-align: left; padding: 0px 20px">
                        <div style="font-size: 16px; font-weight: bold">
                            Daño {{ damage.number }}
                        </div>
                        <div style="color: white; font-size: 12px; margin-top: 3px;">
                            {{ damage.time }}
                        </div>
                    </el-col>
                </el-row>
            </el-card>
        </div>
        <div class="float" v-if="!delete_mode">
            <el-button @click="createDamage()" icon="el-icon-plus" circle></el-button>
            <div style="height: 10px;" />
            <el-button @click="delete_mode = true" icon="el-icon-delete" circle></el-button>
        </div>
        <div class="float delete-buttons" v-else>
            <el-button @click="delete_mode = false" icon="el-icon-close" circle></el-button>
        </div>
        <el-dialog
            :visible="delete_damage_id != null"
            width="80%"
            style="margin-top: 20vh;"
        >
            <span>¿Eliminar daño?</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="delete_damage_id = null">No</el-button>
            <el-button type="primary" @click="deleteDamage(delete_damage_id)">Sí</el-button>
            </span>
        </el-dialog>
		<Navbar/>
    </div>
</template>
<script>
import Navbar from '../components/Navbar.vue';
import BackButton from '../components/BackButton.vue';
import { auth } from "../assets/mixins/auth.js"; 
import Moment from 'moment';
export default {
    components: {
        Navbar,
        BackButton
    },
    mixins: [auth],	
    data() {
        return {
            image_not_found: require('../assets/images/not_found.png'),
            damages: [],
            loading: true,
            sample: {},
            delete_mode: false,
            delete_damage_id: null
        }
    },
    mounted() {
        console.log('damages');
        this.loadDamages();
        this.loadSample();
    },
    methods: {
        goto(route) {
            this.$router.push(route);
        },
        loadDamages() {
            this.damages = [];
            fetch(`${this.authBaseUrl()}/api/samples/${this.$route.params.sample}/damages`, {
                method: 'GET',
                headers: this.authHeaders()
            })
                .then(resp => resp.json()) 
                .then(data => {
                    this.loading = false;
                    for(var damage of data) {
                        this.damages.push({
                            id: damage.id,
                            image: this.image_not_found,
                            number: damage.number,
                            time: `${damage.time.substr(0,10)} ${damage.time.substr(11,8)}`
                        });
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
        createDamage() {
            var number = 1;
            if(this.damages.length>0)
                number = this.damages[this.damages.length-1].number+1;
            fetch(this.authBaseUrl()+'/api/damages/' + this.$route.params.sample, {
                method: 'POST',
                headers: this.authHeaders(),
                body: JSON.stringify({
                    'number': number,
                    'time': Moment().format("YYYY-MM-DD hh:mm:ss")
                })
            })
                .then(resp => {
                    if(resp.status == 200) {
                        this.$message({
                            showClose: true,
                            message: 'Daño creado',
                            type: 'success',
                            center: true,
                            customClass: 'message'
                        });
                        this.dialogVisible = false;
                        this.loadDamages();
                    } else {
                        this.$message({
                            showClose: true,
                            message: 'Error al crear hoja',
                            type: 'error',
                            center: true,
                            customClass: 'message'
                        });
                    }
                }) 
        },
        updateSample() {
            fetch(`${this.authBaseUrl()}/api/samples/${this.$route.params.sample}/update`, {
                method: 'POST',
                headers: this.authHeaders(),
                body: JSON.stringify(this.sample)
            })
                .then(resp => {
                    if(resp.status == 200) {
                        this.$message({
                            showClose: true,
                            message: 'Guardado',
                            type: 'success',
                            center: true,
                            customClass: 'message'
                        });
                        this.dialogVisible = false;
                        this.loadDamages();
                    } else {
                        this.$message({
                            showClose: true,
                            message: 'Error al guardar',
                            type: 'error',
                            center: true,
                            customClass: 'message'
                        });
                    }
                }) 
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
                    });
            }
        },
        deleteDamage(id) {
            fetch(this.authBaseUrl()+'/api/damages/' + id, {
                method: 'DELETE',
                headers: this.authHeaders()
            })
                .then(resp => {
                    if(resp.status == 200) {
                        this.$message({
                            showClose: true,
                            message: 'Daño eliminado',
                            type: 'success',
                            center: true,
                            customClass: 'message'
                        });
                        this.dialogVisible = false;
                        this.loadDamages();
                    } else {
                        this.$message({
                            showClose: true,
                            message: 'Error al eliminar daño',
                            type: 'error',
                            center: true,
                            customClass: 'message'
                        });
                    }
                });
            this.delete_damage_id = null;
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

.float.delete-buttons .el-button {
    border-color: #E63535;
    color: #E63535;
}
</style>