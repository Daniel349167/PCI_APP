<template>
    <div style="width: 90vw; margin: auto">
		<div class="page-title">
			PROYECTOS
		</div>
        <div v-if="loading" v-loading="true" style="height: 160px" />
		<div v-for="project in projects" :key="project.id" style="margin: 20px 0px"
            @click="goto('/projects/'+project.id)"
        >
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
        <div class="float">
            <el-button @click="dialogVisible = true" icon="el-icon-plus" circle></el-button>
        </div>

        <el-dialog
            title="Nuevo proyecto"
            :visible.sync="dialogVisible"
            width="90%"
            style="margin-top: 15vh;"
        >
            <div>
                <label for="new_project_name" class="input-label">Nombre del proyecto</label>
                <el-input v-model="new_project_name" id="new_project_name"/>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createProject()">Confirm</el-button>
                <el-button @click="dialogVisible = false">Cancel</el-button>
            </span>
        </el-dialog>

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
                    console.dir(data);
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
        },
        createProject() {
            fetch(this.authBaseUrl()+'/api/projects', {
                method: 'POST',
                headers: this.authHeaders(),
                body: JSON.stringify({
                    'name': this.new_project_name,
                    'time': Moment().format("YYYY-MM-DD hh:mm:ss")
                })
            })
                .then(resp => {
                    if(resp.status == 200) {
                        this.$message({
                            showClose: true,
                            message: 'Proyecto creado',
                            type: 'success',
                            center: true,
                            customClass: 'message'
                        });
                        this.dialogVisible = false;
                        this.loadProjects();
                    } else {
                        this.$message({
                            showClose: true,
                            message: 'Error al crear proyecto',
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
    font-size: 24px;
}
</style>