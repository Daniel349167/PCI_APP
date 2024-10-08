<template>
    <div style="width: 90vw; margin: auto" v-loading.fullscreen.lock="downloading" :element-loading-text="Math.floor(loadSummariesProgess*100)+'%'">
        <BackButton/>
        <div class="page-title">
            {{ title }}
        </div>
        <div v-if="loading" v-loading="true" style="height: 160px" />
        <div v-for="sample in samples" :key="sample.id" style="margin: 20px 0px" class="blue-card"
            @click="goto(`${$route.params.project}/${sample.id}`)"
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
            loadSummariesProgess: 0,
            downloading: false,
            title: ''
        }
    },
    mounted() {
        console.log('Summaries');
        switch(this.$route.path.split('/')[2]) {
        case 'metering':
            this.title = 'Resumen de Metrado por UM'
            break;
        case 'deduct':
            this.title = 'Resumen de Valores Deducidos por UM'
            break;
        }
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
        async loadSummariesMetering(){
            this.loadSummariesProgess = 0;
            for(var sample of this.samples) {
                await fetch(`${this.authBaseUrl()}/api/damage-measurement/${this.$route.params.project}/${sample.id}`, {
                    method: 'GET',
                    headers: this.authHeaders()
                })
                    .then(resp => resp.json()) 
                    .then(data => {
                        sample.summary = data;
                        this.loadSummariesProgess += 1/this.samples.length;
                    });
            }
        },
        async loadSummariesDeduct(){
            this.loadSummariesProgess = 0;
            for(var sample of this.samples) {
                await fetch(`${this.authBaseUrl()}/api/deducted-values/${this.$route.params.project}/${sample.id}`, {
                    method: 'GET',
                    headers: this.authHeaders()
                })
                    .then(resp => resp.json()) 
                    .then(data => {
                        sample.summary = data;
                        this.loadSummariesProgess += 1/this.samples.length;
                    });
            }
        },
        async downloadPDF(){
            this.downloading = true;
            switch(this.$route.path.split('/')[2]) {
            case 'metering':
                await this.loadSummariesMetering();
                await this.downloadPDFMetering(this.samples);
                break;
            case 'deduct':
                await this.loadSummariesDeduct();
                await this.downloadPDFDeduct(this.samples);
                break;
            }
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
    font-size: 24px;
}
.blue-card .el-card__body  {
    background-color: #2C39A994;
}
</style>