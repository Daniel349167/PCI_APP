<template>
    <div style="width: 90vw; margin: auto">
        <BackButton/>
        <div class="page-title">
                UNIDAD DE MUESTRA
        </div>
        <div class="page-title">
                {{ project.name }}
        </div>
        <el-row>
            <el-col :span="8" style="padding: 4px;">
                <label for="L" class="input-label">L</label>
                <el-input v-model="project.longitudcarretera" id="L" size="mini"/>
            </el-col>
            <el-col :span="8" style="padding: 4px;">
                <label for="A" class="input-label">A</label>
                <el-input v-model="project.anchoum" id="A" size="mini"/>
            </el-col>
            <el-col :span="8" style="padding: 4px;">
                <label for="l" class="input-label">l</label>
                <el-input v-model="project.longitudum" id="l" size="mini"/>
            </el-col>
        </el-row>
        <div v-if="loading" v-loading="true" style="height: 160px" />
        <div v-for="sample in samples" :key="sample.id" style="margin: 20px 0px" class="blue-card"
            @click="goto('/samples/'+sample.id)"
        >
            <el-card>
                <el-row>
                    <el-col :span="8">
                        <el-image :src="sample.image" fit="contain"/>
                    </el-col>
                    <el-col :span="16" style="text-align: left; padding: 0px 20px">
                        <div style="font-size: 16px; font-weight: bold">
                            UM {{ sample.number }}
                        </div>
                        <div style="color: white; font-size: 12px; margin-top: 3px">
                            {{ sample.time }}
                        </div>
                        <div style="font-size: 12px; margin-top: 5px">
                            Del: {{ sample.from }}
                        </div>
                        <div style="font-size: 12px; margin-top: 3px">
                            Al: {{ sample.to }}
                        </div>
                    </el-col>
                </el-row>
            </el-card>
        </div>
        <div class="float">
            <div>
                <el-button @click="createSample()" icon="el-icon-plus" circle></el-button>
            </div>
            <div style="height: 10px;" />
            <div>
                <el-button @click="updateProject()" icon="el-icon-check" circle></el-button>
            </div>
        </div>

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
            project: {
                name: '\xa0',
                longitudum: 0,
                anchoum: 0,
                longitudcarretera: 0
            },
            samples: [],
            loading: true
        }
    },
    mounted() {
        console.log('Samples');
        fetch(`${this.authBaseUrl()}/api/projects/${this.$route.params.project}`, {
            method: 'GET',
            headers: this.authHeaders()
        }).then(resp => resp.json()).then(data => this.project = data); 
        this.loadSamples();
    },
    methods: {
        goto(route) {
            this.$router.push(route);
        },
        loadSamples() {
            this.samples = [];
            fetch(`${this.authBaseUrl()}/api/projects/${this.$route.params.project}/samples`, {
                method: 'GET',
                headers: this.authHeaders()
            })
                .then(resp => resp.json()) 
                .then(data => {
                    console.dir(data);
                    this.loading = false;
                    for(var sample of data) {
                        this.samples.push({
                            id: sample.id,
                            image: sample.image ? sample.image : this.image_not_found,
                            number: sample.number,
                            time: `${sample.time.substr(0,10)} ${sample.time.substr(11,8)}`,
                            from: 
                                (sample.from_km!=null ? sample.from_km : '') + 'km + ' + 
                                (sample.from_m!=null ? sample.from_m : '')+ 'm',
                            to: 
                                (sample.to_km!=null ? sample.to_km : '') + 'km + ' + 
                                (sample.to_m!=null ? sample.to_m : '') + 'm',
                        });
                    }
                }); 
        },
        createSample() {
            fetch(this.authBaseUrl()+'/api/samples/' + this.$route.params.project, {
                method: 'POST',
                headers: this.authHeaders(),
                body: JSON.stringify({
                    'number': this.samples.length+1,
                    'time': Moment().format("YYYY-MM-DD hh:mm:ss")
                })
            })
                .then(resp => {
                    if(resp.status == 200) {
                        
                        this.$message({
                            showClose: true,
                            message: 'Unidad de muestra creada',
                            type: 'success',
                            center: true,
                            customClass: 'message'
                        });
                        this.dialogVisible = false;
                        this.loadSamples();
                    } else {
                        this.$message({
                            showClose: true,
                            message: 'Error al crear unidad de muestra',
                            type: 'error',
                            center: true,
                            customClass: 'message'
                        });
                    }
                }) 
        },
        updateProject() {
            fetch(`${this.authBaseUrl()}/api/projects/${this.$route.params.project}/update`, {
                method: 'POST',
                headers: this.authHeaders(),
                body: JSON.stringify(this.project)
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