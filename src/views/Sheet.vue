<template>
    <div style="width: 90vw; margin: auto">
        <BackButton/>
		<div class="page-title">
			Daño {{ form.number }}
		</div>
        <div style="margin: 20px 0px" class="damage-sheet-form">
            <el-row>
                <el-col :span="10">
                    <label for="type" class="input-label">Tipo</label>
                    <el-input v-model="form.type" type="number" size="mini" id="type" min="1" max="23"/>
                </el-col>
                <el-col :span="10">
                    <label for="amount" class="input-label">Cantidad</label>
                    <el-input v-model="form.amount" type="number" size="mini" id="amount" min=".1"/>
                </el-col>
            </el-row>
            <el-row>
                <el-col>
                    <label for="severity" class="input-label">Severidad</label>
                    <el-radio-group v-model="form.severity" size="mini" id="severity">
                        <el-radio-button label="1">L</el-radio-button>
                        <el-radio-button label="2">M</el-radio-button>
                        <el-radio-button label="3">H</el-radio-button>
                    </el-radio-group>
                </el-col>
            </el-row>
        </div>
        <el-image :src="form.image" fit="contain" v-if="form.image" ref="image"/>
        <el-row style="position: fixed; bottom: 80px; left: 0; width: 100%;">
            <el-col :span="12">
                <el-button icon="el-icon-camera" @click="camera()" style="font-size: 24px"></el-button>
            </el-col>
            <el-col :span="12">
                <el-button icon="el-icon-check" @click="updateDamage()" style="font-size: 24px"></el-button>
            </el-col>
        </el-row>
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
            form: {
                type: null
            },
            image: null
        }
    },
    mounted() {
        this.loadDamage();
        this.getImage();
        console.log(this)
    },
    methods: {
        camera() {
            if(!window.navigator)
                return;
            const self = this;
            navigator.camera.getPicture(
                async function(event) { 
                    console.log('getPicture');
                    self.form.image = 'data:image/jpg;base64,' + event;
                    self.$forceUpdate();
                },
                function(event) { 
                    console.log('Error')
                },
                {
                    sourceType: Camera.PictureSourceType.CAMERA,
                    destinationType: Camera.DestinationType.DATA_URL,
                    targetWidth: 600,
                    targetHeight: 600
                }
            )
        },
        loadDamage() {
            fetch(this.authBaseUrl()+'/api/damages/' + this.$route.params.damage, {
                method: 'GET',
                headers: this.authHeaders()
            })
                .then(resp => resp.json()) 
                .then(data => {
                    this.form = data;
                });
        },
        updateDamage() {
            if(this.form.type < 1 || this.form.type > 23) {
                this.$message({
                    showClose: true,
                    message: 'El tipo debe ser entre 1 y 23',
                    type: 'warning',
                    center: true,
                    customClass: 'message'
                });
                return;
            }
            if(this.form.amount <= 0) {
                this.$message({
                    showClose: true,
                    message: 'La cantidad debe ser positiva',
                    type: 'warning',
                    center: true,
                    customClass: 'message'
                });
                return;
            }
            fetch(`${this.authBaseUrl()}/api/damages/${this.$route.params.damage}/update`, {
                method: 'POST',
                headers: this.authHeaders(),
                body: JSON.stringify(this.form)
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
        },
        getImage() {
            fetch(`${this.authBaseUrl()}/api/damages/${this.$route.params.damage}/image`, {
                method: 'GET',
                headers: this.authHeaders()
            })
                .then(resp => resp.json()) 
                .then(data => {
                    this.form.image = data.image;
                    this.$forceUpdate();
                });
        }
    }
}
</script>
<style>
.damage-sheet-form .el-col {
    margin: 10px
}
</style>