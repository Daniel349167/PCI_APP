<template>
    <div style="width: 90vw; margin: auto">
        <BackButton/>
        <div class="page-title">
            PROYECTOS
        </div>
        <div v-if="loading" v-loading="true" style="height: 160px" />
        <div v-if="!delete_mode">
            <div v-for="project in projects" :key="project.id" style="margin: 20px 0px"
                @click="goto('/projects/'+project.id)"
            >
                <el-card>
                    <el-row>
                        <el-col :span="8">
                            <el-image :src="project.image" fit="contain"/>
                        </el-col>
                        <el-col :span="16" style="text-align: left; padding: 0px 20px">
                            <div style="font-size: 16px; font-weight: bold">
                                {{ project.name }}
                            </div>
                            <div style="color: white; font-size: 12px; margin-top: 3px">
                                {{ project.time }}
                            </div>
                        </el-col>
                    </el-row>
                </el-card>
            </div>
        </div>
        <div v-else>
            <div v-for="project in projects" :key="project.id" style="margin: 20px 0px"
                @click="delete_project_id = project.id"
            >
                <el-card class="delete-card">
                    <el-row>
                        <el-col :span="8">
                            <el-image :src="project.image" fit="contain"/>
                        </el-col>
                        <el-col :span="16" style="text-align: left; padding: 0px 20px">
                            <div style="font-size: 16px; font-weight: bold">
                                {{ project.name }}
                            </div>
                            <div style="color: white; font-size: 12px; margin-top: 3px">
                                {{ project.time }}
                            </div>
                        </el-col>
                    </el-row>
                </el-card>
            </div>
        </div>
        <div class="float" v-if="!delete_mode">
            <el-button @click="dialogVisible = true" icon="el-icon-plus" circle></el-button>
            <div style="height: 10px;" />
            <el-button @click="delete_mode = true" icon="el-icon-delete" circle></el-button>
        </div>
        <div class="float delete-buttons" v-else>
            <el-button @click="dialogVisible = true" icon="el-icon-plus" circle></el-button>
            <div style="height: 10px;" />
            <el-button @click="delete_mode = false" icon="el-icon-delete" circle></el-button>
        </div>

        <el-dialog
            title="Nuevo proyecto"
            :visible.sync="dialogVisible"
            width="90%"
            style="margin-top: 7vh;"
        >
            <div>
                <label for="new_project_name" class="input-label">Nombre del proyecto</label>
                <el-input v-model="form.name" id="new_project_name"/>
            </div>
            <div>
                <label for="L" class="input-label"><tt>L</tt> (km)</label>
                <el-input v-model="form.longitudcarretera" id="L" type="number" min="0"/>
            </div>
            <div>
                <label for="A" class="input-label"><tt>A</tt> (m)</label>
                <el-input v-model="form.anchoum" id="A" type="number" min="0"/>
            </div>
            <div>
                <label for="l" class="input-label"><tt>l</tt> (m)</label>
                <el-input v-model="form.longitudum" id="l" type="number" min="0"/>
            </div>
            <div v-if="goodAl" style="text-align: left; height: 0px; margin-top: 10px">
                <tt>A*l = {{ form.anchoum*form.longitudum }}m²</tt>
            </div>
            <div v-else style="text-align: left; height: 0px; margin-top: 10px; color: red">
                <tt>A*l = {{ form.anchoum*form.longitudum }}m²</tt>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createProject()">Confirm</el-button>
                <el-button @click="dialogVisible = false">Cancel</el-button>
            </span>
        </el-dialog>
        <el-dialog
            :visible="delete_project_id != null"
            width="80%"
            style="margin-top: 20vh;"
        >
            <span>¿Eliminar proyecto?</span>
            <span slot="footer" class="dialog-footer">
            <el-button @click="delete_project_id = null">No</el-button>
            <el-button type="primary" @click="deleteProject(delete_project_id)">Sí</el-button>
            </span>
        </el-dialog>

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
            projects: [],
            loading: true,
            dialogVisible: false,
            form: {
                name: '',
                anchoum: null,
                longitudum: null,
                longitudcarretera: null
            },
            delete_mode: false,
            delete_project_id: null,
        }
    },
    mounted() {
        console.log('Projects');
        this.loadProjects()
    },
    computed: {
        goodAl() {
            return this.form.longitudum*this.form.anchoum >= 135 && this.form.longitudum*this.form.anchoum <= 315;
        }
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
        },
        createProject() {
            if(!this.form.name) {
                this.$message({
                    showClose: true,
                    message: 'Introduzca el nombre del proyecto',
                    type: 'warning',
                    center: true,
                    customClass: 'message'
                });
                return;
            }
            if(this.form.longitudum <= 0 || this.form.anchoum <= 0 || this.form.longitudcarretera <= 0) {
                this.$message({
                    showClose: true,
                    message: 'Las distancias deben ser positivas',
                    type: 'warning',
                    center: true,
                    customClass: 'message'
                });
                return;
            }
            if(!this.goodAl) {
                this.$message({
                    showClose: true,
                    message: 'A*l debe valer entre 135 y 315',
                    type: 'warning',
                    center: true,
                    customClass: 'message'
                });
                return;
            }
            this.form.time = Moment().format("YYYY-MM-DD hh:mm:ss");
            fetch(this.authBaseUrl()+'/api/projects', {
                method: 'POST',
                headers: this.authHeaders(),
                body: JSON.stringify(this.form)
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
        },
        deleteProject(id) {
            fetch(this.authBaseUrl()+'/api/projects/' + id, {
                method: 'DELETE',
                headers: this.authHeaders()
            })
                .then(resp => {
                    this.$message({
                        showClose: true,
                        message: 'Proyecto eliminado',
                        type: 'success',
                        center: true,
                        customClass: 'message'
                    });
                    this.loadProjects();
                })
                .catch(err => {
                    this.$message({
                        showClose: true,
                        message: 'Error al eliminar proyecto',
                        type: 'error',
                        center: true,
                        customClass: 'message'
                    });
                });
            this.delete_project_id = null;
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
.float.delete-buttons .el-button {
    border-color: #E63535;
    border-width: 3px;
    color: #E63535;
    font-size: 24px;
}
</style>