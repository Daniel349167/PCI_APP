<template>
    <div style="width: 90vw; margin: auto">
        <BackButton/>
		<div class="page-title">
			{{ title }}
		</div>
        <div v-if="loading" v-loading="true" style="height: 160px" />
        <div v-for="sample in samples" :key="sample.id" style="margin: 20px 0px" class="blue-card"
            @click="goto(`${$route.params.summary}/${sample.id}`)"
        >
            <el-card>
                <el-row>
                    <el-col :span="8">
                        <el-image :src="sample.image" fit="contain"/>
                    </el-col>
                    <el-col :span="16" style="text-align: left; padding: 0px 20px">
                        <div>
                            UM {{ sample.number }}
                        </div>
                        <div style="color: white; font-size: 12px;">
                            {{ sample.time }}
                        </div>
                    </el-col>
                </el-row>
            </el-card>
        </div>
        <div class="float">
            <el-button @click="downloadPDF" icon="el-icon-download" circle></el-button>
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
            samples: [],
            loading: true,
            title: ''
        }
    },
    mounted() {
        console.log('Summaries');
        switch(this.$route.params.summary) {
        case 'metering':
            this.title = 'Resumen de Metrado por UM'
            break;
        case 'deduct':
            this.title = 'Resumen de Valores Deducidos po UM'
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
        downloadPDF(){

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