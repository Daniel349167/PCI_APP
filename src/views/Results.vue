<template>
    <div style="width: 90vw; margin: auto">
		<div class="page-title">
			RESULTADOS
		</div>
        <div v-if="loading" v-loading="true" style="height: 160px" />
		<div v-for="(project, index) in projects" :key="index" style="margin: 20px 0px">
			<el-card>
				<el-row>
					<el-col :span="8">
						<el-image :src="project.image" fit="contain"/>
					</el-col>
					<el-col :span="16" style="text-align: left; padding: 0px 20px">
						<div>
							{{ project.name }}
						</div>
						<div style="color: white; font-size: 12px;">
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
import { auth } from "../assets/mixins/auth.js"; 
import Moment from 'moment';
export default {
    components: {
    Navbar
    },
    mixins: [auth],	
    data() {
        return {
            logo: require('../assets/images/logo.png'),
            image_not_found: require('../assets/images/not_found.png'),
            projects: [],
            loading: true,
            dialogVisible: false,
            new_project_name: ''
        }
    },
    mounted() {
        console.log('Projects');
        this.loadProjects()
    },
    methods: {
        loadProjects() {
            fetch(this.authBaseUrl()+'/api/projects', {
                method: 'GET',
                headers: this.authHeaders()
            })
                .then(resp => resp.json()) 
                .then(data => {
                    console.dir(data);
                    this.loading = false;
                    for(var project of data) {
                        this.projects.push({
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
<style scoped>
.float {
	position: fixed;
	bottom: 80px;
	right: 20px;
}
.float .el-button {
    border-color: #2ECC74;
    border-width: 3px;
    color: #2ECC74;
}
</style>