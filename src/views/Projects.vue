<template>
    <div style="width: 90vw; margin: auto">
        <BackButton/>
        <div class="page-title">
            PROYECTOS
        </div>
        <div v-if="loading" v-loading="true" style="height: 160px" />
        <div>
            <div v-for="project in projects" :key="project.id" style="margin: 20px 0px"
            @click="delete_mode ? (delete_project_id = project.id) : goto('/projects/'+project.id)">
            <el-card :class="{
                'delete-card': delete_mode,
                'el-card-verde': !delete_mode,
                'el-card-azul': delete_mode
            }">
                    <el-row>
                        <el-col :span="8">
                            <el-image :src="project.image" fit="contain"/>
                        </el-col>
                        <el-col :span="14" style="text-align: left; padding: 0px 20px">
                            <div style="font-size: 16px; font-weight: bold">
                                {{ project.name }}
                            </div>
                            <div style="color: white; font-size: 12px; margin-top: 3px">
                                {{ project.time }}
                            </div>
                        </el-col>
                        <el-col :span="2" style="position: absolute; top: -15px; right: -15px;">
                            <!-- Menú personalizado -->
                            <div class="custom-dropdown">
                                <span @click.stop="toggleMenu(project.id)">⋮</span> <!-- Usamos @click.stop -->
                                <ul v-if="activeDropdown === project.id" class="custom-dropdown-menu">
                                    <li @click.stop="editProjectName(project)">Editar Nombre</li>
                                </ul>
                            </div>
                        </el-col>

                    </el-row>
                </el-card>
            </div>



        </div>
        <div class="float" v-if="!delete_mode">
            <el-button @click="delete_mode = true" icon="el-icon-delete" circle></el-button>
            <el-button @click="dialogVisible = true" icon="el-icon-plus" circle></el-button>
        
        </div>
        <div class="float delete-buttons" v-else>
            <el-button @click="delete_mode = false" icon="el-icon-close" circle></el-button>
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
            width="90%"
            :before-close="() => delete_project_id = null"
            center
            class="custom-delete-modal"
        >
            <div style="text-align: center;">
                <el-icon style="font-size: 48px; color: #f56c6c;">
                    <i class="el-icon-warning"></i>
                </el-icon>
                <p style="font-size: 18px; font-weight: bold; margin-top: 10px; color: #333;">
                    ¿Eliminar proyecto "{{ projectToDelete.name }}"?
                </p>
                <p style="font-size: 14px; color: #666; margin-top: 5px;">
                    Esta acción no se puede deshacer. ¿Estás seguro?
                </p>
            </div>
            <span slot="footer" class="dialog-footer" style="text-align: center; padding: 10px 0;">
                <el-button @click="delete_project_id = null" style="width: 120px;">No</el-button>
                <el-button 
                    type="danger" 
                    @click="deleteProject(delete_project_id)" 
                    style="width: 120px; margin-left: 10px;">
                    Sí
                </el-button>
            </span>
        </el-dialog>



        <el-dialog
            title="Editar nombre del proyecto"
            :visible.sync="editDialogVisible"
            width="90%"
        >
            <div>
                <label for="edit_project_name" class="input-label">Nombre del proyecto</label>
                <el-input v-model="editForm.name" id="edit_project_name"/>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">Cancelar</el-button>
                <el-button type="primary" @click="saveProjectName">Guardar</el-button>
            </span>
        </el-dialog>

        <Navbar/>
    </div>
</template>
<script>
import Navbar from '../components/Navbar.vue';
import BackButton from '../components/BackButton.vue';
import { auth } from "../assets/mixins/auth.js"; 
import { sqlite } from '../assets/mixins/sqlite.js';
import Moment from 'moment';
export default {
    components: {
        Navbar,
        BackButton
    },
    mixins: [auth, sqlite],    
    data() {
        return {
            image_not_found: require('../assets/images/not_found.png'),
            projects: [],
            loading: true,
            dialogVisible: false,
            editDialogVisible: false,
            activeDropdown: null,
            editForm: {
                id: null,
                name: ''
            },
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
        },
        projectToDelete() {
            return this.projects.find(project => project.id === this.delete_project_id) || {};
        }
    },
    methods: {
        toggleMenu(projectId) {
            // Alterna el menú desplegable. Si está abierto, lo cierra.
            this.activeDropdown = this.activeDropdown === projectId ? null : projectId;
        },
        editProjectName(project) {
            this.editForm.id = project.id;
            this.editForm.name = project.name;
            this.editDialogVisible = true; // Muestra el modal
            this.activeDropdown = null; // Cierra el menú desplegable
        },
        saveProjectName() {
            fetch(`${this.authBaseUrl()}/api/projects/${this.editForm.id}`, {
                method: 'PUT',
                headers: this.authHeaders(),
                body: JSON.stringify({ name: this.editForm.name })
            })
            .then(resp => resp.json())
            .then(data => {
                if (data.message === 'Project name updated successfully') {
                    this.$message({
                        message: 'Nombre del proyecto actualizado',
                        type: 'success',
                        showClose: true,
                    });
                    this.editDialogVisible = false;
                    this.loadProjects();
                } else {
                    this.$message({
                        message: 'Error al actualizar el nombre del proyecto',
                        type: 'error',
                        showClose: true,
                    });
                }
            });
        },
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
                    if(resp.status == 200) {
                        this.$message({
                            showClose: true,
                            message: 'Proyecto eliminado',
                            type: 'success',
                            center: true,
                            customClass: 'message'
                        });
                        this.dialogVisible = false;
                        this.loadProjects();
                    } else {
                        this.$message({
                            showClose: true,
                            message: 'Error al eliminar proyecto',
                            type: 'error',
                            center: true,
                            customClass: 'message'
                        });
                    }
                });
            this.delete_project_id = null;
        }
    }
}
</script>
<style>
.float {
    position: fixed;
    bottom: 80px;
    right: 10px;
    display: flex;
    justify-content: space-between;
    width: 93%; /* Ajusta el ancho si es necesario */
}
.float .el-button {
    border-color: #2ECC74 !important;
    border-width: 3px;
    color: #2ECC74 !important;
    font-size: 24px;
}
.float.delete-buttons .el-button {
    border-color: #E63535;
    color: #E63535;
}

.el-card-verde {
    border: 3px solid #28B065 !important; /* Un tono más oscuro que el fondo */
}
.el-card-azul {
    border: 3px solid #0099CC !important; /* Borde azul cuando está en modo delete */
}

.custom-dropdown {
    position: relative;
    display: inline-block;
}

.custom-dropdown span {
    cursor: pointer;
    font-size: 24px;
    font-weight: bold;
}

.custom-dropdown-menu {
    position: absolute;
    background-color: white;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    z-index: 1000;
    list-style-type: none;
    padding: 0;
    margin: 0;
    width: 150px;
    top: 100%;
    right: 0;
}

.custom-dropdown-menu li {
    padding: 10px;
    cursor: pointer;
    border-bottom: 1px solid #eee;
}

.custom-dropdown-menu li:hover {
    background-color: #f5f5f5;
}

.custom-delete-modal .el-dialog__footer {
    text-align: center;
}

.custom-delete-modal p {
    margin: 0;
    padding: 5px 0;
}

</style>