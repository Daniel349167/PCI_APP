<template>
    <div style="width: 90vw; margin: auto">
		<div class="page-title">
			HOJA DE RELEVAMIENTO
		</div>
		<div class="page-title">
			UM {{ $route.params.sample }}
		</div>
        <div style="height: 20px" />
        <el-form ref="form" :model="form" label-width="80px" size="mini">
            <el-form-item label="Del:">
                <el-input v-model="form.from_km" style="width: 50px;"></el-input> km + 
                <el-input v-model="form.from_m" style="width: 50px;"></el-input> m
            </el-form-item>
            <el-form-item label="Al:">
                <el-input v-model="form.tok_m" style="width: 50px;"></el-input> km + 
                <el-input v-model="form.to_m" style="width: 50px;"></el-input> m
            </el-form-item>
            <el-form-item label="Sección:">
                <el-radio-group v-model="form.section">
                    <el-radio-button label="Izquierda" ></el-radio-button>
                    <el-radio-button label="Derecha" ></el-radio-button>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div v-if="loading" v-loading="true" style="height: 160px" />
        <div v-for="damage in damages" :key="damage.id" style="margin: 20px 0px" class="blue-card"
            @click="goto('/damages/'+damage.id)"
        >
            <el-card>
                <el-row>
                    <el-col :span="8">
                        <el-image :src="damage.image" fit="contain"/>
                    </el-col>
                    <el-col :span="16" style="text-align: left; padding: 0px 20px">
                        <div>
                            Daño {{ damage.number }}
                        </div>
                        <div style="color: white; font-size: 12px;">
                            {{ damage.time }}
                        </div>
                    </el-col>
                </el-row>
            </el-card>
        </div>
        <div class="float">
            <div>
                <el-button @click="''" icon="el-icon-check" circle></el-button>
            </div>
            <div style="height: 10px;" />
            <div>
                <el-button @click="createDamage()" icon="el-icon-plus" circle></el-button>
            </div>
        </div>
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
            damages: [],
            loading: true,
            form: {}
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
                            image: damage.image ? damage.image : this.image_not_found,
                            number: damage.number,
                            time: `${damage.time.substr(0,10)} ${damage.time.substr(11,8)}`
                        });
                    }
                }); 
        },
        loadSample() {
            this.form = {
                from_km: 0,
                from_m: 0,
                to_km: 0,
                to_m: 0,
                section: 'Derecha'
            }
        },
        createDamage() {
            fetch(this.authBaseUrl()+'/api/damages/' + this.$route.params.sample, {
                method: 'POST',
                headers: this.authHeaders(),
                body: JSON.stringify({
                    'number': this.damages.length+1,
                    'time': Moment().format("YYYY-MM-DD hh:mm:ss")
                })
            })
                .then(resp => {
                    if(resp.status == 200) {
                        this.$message({
                            showClose: true,
                            message: 'Hoja creada',
                            type: 'success',
                            center: true,
                            customClass: 'message'
                        });
                        this.dialogVisible = false;
                        this.loaddamages();
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