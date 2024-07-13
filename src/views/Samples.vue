<template>
    <div style="width: 90vw; margin: auto">
		<div class="page-title">
			UNIDAD DE MUESTRA
		</div>
		<div class="page-title">
			Proyecto {{ $route.params.sample }}
		</div>
        <div v-if="loading" v-loading="true" style="height: 160px" />
		<div style="width: calc(100% - 60px);">
            <div v-for="(project, index) in projects" :key="index" style="margin: 20px 0px" class="blue-card"
                @click="goto('/projects/'+$route.params.sample+'/'+(index+1))"
            >
                <el-card>
                    <el-row>
                        <el-col :span="8">
                            <el-image :src="project.image" fit="contain"/>
                        </el-col>
                        <el-col :span="16" style="text-align: left; padding: 0px 20px">
                            <div>
                                UM 
                            </div>
                            <div style="color: white; font-size: 12px;">
                                {{ project.time }}
                            </div>
                        </el-col>
                    </el-row>
                </el-card>
            </div>
        </div>
        <div class="float">
            <div>
                <el-button @click="dialogVisible = true" icon="el-icon-plus" circle></el-button>
            </div>
            <br />
            <div>
                <el-button @click="dialogVisible = true" icon="el-icon-upload" circle></el-button>
            </div>
        </div>

        <el-dialog
            title="Nueva unidad"
            :visible.sync="dialogVisible"
            width="90%"
            style="margin-top: 15vh;"
        >
            <div>
                <label for="new_project_name" class="input-label">Nombre de la unidad</label>
                <el-input v-model="new_project_name" id="new_project_name"/>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">Confirm</el-button>
                <el-button @click="dialogVisible = false">Cancel</el-button>
            </span>
        </el-dialog>

		<Navbar/>
    </div>
</template>
<script>
import Navbar from '../components/Navbar.vue';
import { auth } from "../assets/mixins/auth.js"; 
export default {
    components: {
    Navbar
    },
    mixins: [auth],	
    data() {
        return {
            logo: require('../assets/images/logo.png'),
            image_not_found: 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png',
            projects: [],
            loading: true,
            dialogVisible: false,
            new_project_name: ''
        }
    },
    mounted() {
        console.log('Projects');

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
    },
    methods: {
        goto(route) {
            this.$router.push(route);
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