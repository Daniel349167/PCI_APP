<template>
    <div style="width: 90vw; margin: auto" v-loading.fullscreen.lock="downloading" :element-loading-text="Math.floor(loadDamagesProgess*100)+'%'">
        <BackButton/>
		<div class="page-title">
			Inventario de fallas
		</div>
        <div v-if="loading" v-loading="true" style="height: 160px" />
        <div v-for="sample in samples" :key="sample.id" style="margin: 20px 0px" class="blue-card"
            @click="goto($route.params.project+'/'+sample.id)"
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
                    </el-col>
                </el-row>
            </el-card>
        </div>
        <div class="float">
            <el-button @click="downloadPDF" icon="el-icon-download" circle></el-button>
        </div>
		<Navbar :resultId="$route.params.project"/>
    </div>
</template>
<script>
import Navbar from '../components/Navbar.vue';
import BackButton from '../components/BackButton.vue';
import { auth } from "../assets/mixins/auth.js"; 
import { pdfmixin } from '../assets/mixins/pdf.js';
export default {
    components: {
        Navbar,
        BackButton
    },
    mixins: [auth,pdfmixin],	
    data() {
        return {
            image_not_found: require('../assets/images/not_found.png'),
            samples: [],
            loading: true,
            content: '',
            loadDamagesProgess: 0,
            downloading: false
        }
    },
    mounted() {
        console.log('DamageLists');
        this.loadSamples();
        console.log(content=>{
            this.content = content;
        });
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
                    this.loading = false;
                    for(var sample of data) {
                        this.samples.push({
                            id: sample.id,
                            image: sample.image ? sample.image : this.image_not_found,
                            number: sample.number,
                            time: `${sample.time.substr(0,10)} ${sample.time.substr(11,8)}`
                        });
                    }
                }); 
        },
        async loadDamages() {
            this.loadDamagesProgess = 0;
            for (var sample of this.samples) {
                await fetch(`${this.authBaseUrl()}/api/samples/${sample.id}/damages`, {
                    method: 'GET',
                    headers: this.authHeaders()
                })
                    .then(resp => resp.json()) 
                    .then(async (data) => {
                        sample.damages = data;
                        if(sample.damages.length==0)
                            this.loadDamagesProgess += 1/this.samples.length;
                        for(var damage of sample.damages) {
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
                                    this.loadDamagesProgess += 1/this.samples.length/sample.damages.length;
                                });
                        }
                    }); 
            }
            console.log('loadDamages end');
        },
        async downloadPDF(){
            this.downloading = true;
            await this.loadDamages();
            await this.downloadPDFList(this.samples);
            this.downloading = false;
            this.$message({
                showClose: true,
                message: 'Archivos descargados',
                type: 'success',
                center: true,
                customClass: 'message'
            });
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