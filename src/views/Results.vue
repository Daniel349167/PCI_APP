<template>
    <div style="width: 90vw; margin: auto">
		<BackButton/>
		<div class="page-title">
			RESULTADOS
		</div>
        <div v-if="loading" v-loading="true" style="height: 160px" />
		<div v-for="project in projects" :key="project.id" style="margin: 20px 0px"
            @click="goto('/results/'+project.id)"
        >
        <el-card class="el-card-verde">
				<el-row>
					<el-col :span="8">
						<el-image :src="project.image" fit="contain"/>
					</el-col>
					<el-col :span="16" style="text-align: left; padding: 0px 20px">
						<div style="font-size: 16px; font-weight: bold">
							{{ project.name }}
						</div>
						<div style="color: white; font-size: 12px; margin-top: 3px;">
							{{ project.time }}
						</div>
					</el-col>
				</el-row>
			</el-card>
		</div>

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
            projects: [],
            loading: true,
            dialogVisible: false,
            new_project_name: ''
        }
    },
    mounted() {
        console.log('Results');
        this.loadProjects()
    },
    methods: {
        goto(route) {
            this.$router.push(route);
        },
        loadProjects() {
            this.projects = [];
            fetch(this.authBaseUrl()+'/api/projects', {
                method: 'GET',
                headers: this.authHeaders()
            })
                .then(resp => resp.json()) 
                .then(data => {
                    this.loading = false;
                    for(var project of data) {
                        this.projects.push({
                            id: project.id,
                            image: project.image ? project.image : this.image_not_found,
                            name: project.name,
                            time: `${project.time.substr(0,10)} ${project.time.substr(11,8)}`
                        });
                    }
                }); 
        }
    }
}
</script>
<style>
.project-results .el-card__body {
    padding: 10px 20px;
}

.el-card-verde {
    border: 3px solid #28B065 !important; /* Un tono más oscuro que el fondo */
}
</style>