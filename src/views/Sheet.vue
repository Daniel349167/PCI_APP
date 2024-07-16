<template>
    <div style="width: 90vw; margin: auto">
		<div class="page-title">
			Daño {{ $route.params.survey }}
		</div>
        <div style="height: 20px" />
        <el-form ref="form" :model="form" label-width="90px" size="small">
            <el-form-item label="Tipo (1-19)">
                <el-input v-model="form.type" type="number"></el-input>
            </el-form-item>
            <el-form-item label="Severidad">
                <el-radio-group v-model="form.severity">
                    <el-radio-button label="L" ></el-radio-button>
                    <el-radio-button label="M" ></el-radio-button>
                    <el-radio-button label="H" ></el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="Cantidad">
                <el-input v-model="form.amount" type="number"></el-input>
            </el-form-item>
        </el-form>
        <el-row style="position: fixed; bottom: 80px; left: 0; width: 100%;">
            <el-col :span="12">
                <el-button icon="el-icon-camera"></el-button>
            </el-col>
            <el-col :span="12">
                <el-button icon="el-icon-files"></el-button>
            </el-col>
        </el-row>
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
            form: {
                type: null
            }
        }
    },
    methods: {
        camera() {
            if(!window.navigator)
                return;
            const self = this;
            navigator.camera.getPicture(
                async function(event) { 
                    console.log('getPicture');
                    self.form.image_url = 'data:image/jpg;base64,' + event;
                    await fetch(self.form.image_url)
                        .then(response => response.blob())
                        .then(blob => {
                            const fd = new FormData();
                            var filename = new Date().getTime() + '.jpg';
                            fd.set('imgfile', blob, filename);
                            self.image = fd.get('imgfile');
                        });
                    console.log('self.image');
                    console.dir(self.image);
                },
                function(event) { 
                    console.log('Error')
                    console.dir(event);
                },
                {
                    sourceType: Camera.PictureSourceType.CAMERA,
                    destinationType: Camera.DestinationType.DATA_URL,
                    targetWidth: 600,
                    targetHeight: 600
                }
            )
        }
    }
}
</script>