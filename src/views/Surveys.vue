<template>
    <div style="width: 90vw; margin: auto">
		<div class="page-title">
			HOJA DE RELEVAMIENTO
		</div>
		<div class="page-title">
			UM {{ $route.params.sample }}
		</div>
        <div style="height: 20px" />
        <el-form ref="form" :model="form" label-width="90px" size="mini">
            <el-form-item label="Del:">
                <el-input v-model="form.from" type="text"></el-input>
            </el-form-item>
            <el-form-item label="Al:">
                <el-input v-model="form.to" type="text"></el-input>
            </el-form-item>
            <el-form-item label="Sección:">
                <el-radio-group v-model="form.section">
                    <el-radio-button label="Izquierda" ></el-radio-button>
                    <el-radio-button label="Derecha" ></el-radio-button>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <div v-if="loading" v-loading="true" style="height: 160px" />
        <div v-for="survey in surveys" :key="survey.id" style="margin: 20px 0px" class="blue-card"
            @click="goto('/surveys/'+survey.id)"
        >
            <el-card>
                <el-row>
                    <el-col :span="8">
                        <el-image :src="survey.image" fit="contain"/>
                    </el-col>
                    <el-col :span="16" style="text-align: left; padding: 0px 20px">
                        <div>
                            Daño {{ survey.number }}
                        </div>
                        <div style="color: white; font-size: 12px;">
                            {{ survey.time }}
                        </div>
                    </el-col>
                </el-row>
            </el-card>
        </div>
        <div class="float">
            <div>
                <el-button @click="createSurvey()" icon="el-icon-plus" circle></el-button>
            </div>
            <div style="height: 10px;" />
            <div>
                <el-button @click="''" icon="el-icon-files" circle></el-button>
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
            surveys: [],
            loading: true,
            form: {}
        }
    },
    mounted() {
        console.log('Surveys');
        this.loadSurveys();
        this.loadSample();
    },
    methods: {
        goto(route) {
            this.$router.push(route);
        },
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
                            id: survey.id,
                            image: survey.image ? survey.image : this.image_not_found,
                            number: survey.number,
                            time: `${survey.time.substr(0,10)} ${survey.time.substr(11,8)}`
                        });
                    }
                }); 
        },
        loadSample() {
            this.form = {
                from: '40km+30m',
                to: '40km+30m',
                section: 'Derecha'
            }
        },
        createSurvey() {
            fetch(this.authBaseUrl()+'/api/surveys/' + this.$route.params.sample, {
                method: 'POST',
                headers: this.authHeaders(),
                body: JSON.stringify({
                    'number': this.surveys.length+1,
                    'time': Moment().format("YYYY-MM-DD hh:mm:ss")
                })
            })
                .then(resp => {
                    if(resp.status == 200) {
                        alert("Hoja creada");
                        this.dialogVisible = false;
                        this.loadSurveys();
                    } else {
                        alert("Error al crear hoja");
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
}
.blue-card .el-card__body  {
    background-color: #2C39A994;
}
</style>