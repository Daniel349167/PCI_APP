<template>
    <div style="width: 90vw; margin: auto" v-loading.fullscreen.lock="downloading">
        <BackButton/>
		<div class="page-title">
			Inventario de fallas
		</div>
        <div v-if="loading" v-loading="true" style="height: 160px" />
        <div v-for="sample in samples" :key="sample.id" style="margin: 20px 0px" class="blue-card"
            @click="goto('/damagelist/'+sample.id)"
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
            content: '',
            downloading: false
        }
    },
    mounted() {
        console.log('DamageLists');
        this.loadSamples();
        console.log(content=>{
            this.content = content;
        });
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
                    console.dir(data);
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
        async loadDamages() {
            for (var sample of this.samples) {
                await fetch(`${this.authBaseUrl()}/api/samples/${sample.id}/damages`, {
                    method: 'GET',
                    headers: this.authHeaders()
                })
                    .then(resp => resp.json()) 
                    .then(async (data) => {
                        sample.damages = data;
                        for(var damage of sample.damages) {
                            await fetch(`${this.authBaseUrl()}/api/damages/${damage.id}/image`, {
                                method: 'GET',
                                headers: this.authHeaders(),
                            })
                                .then(resp => resp.json()) 
                                .then(data => {
                                    if(data.image)
                                        damage.image = data.image;
                                    else
                                        damage.image = this.image_not_found;
                                });
                        }
                    }); 
            }
            console.log('loadDamages end');
        },
        async downloadPDF() {
            this.downloading = true;
            function b64toBlob(b64Data, contentType, sliceSize) {
                contentType = contentType || '';
                sliceSize = sliceSize || 512;

                var byteCharacters = atob(b64Data);
                var byteArrays = [];

                for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
                    var slice = byteCharacters.slice(offset, offset + sliceSize);

                    var byteNumbers = new Array(slice.length);
                    for (var i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }

                    var byteArray = new Uint8Array(byteNumbers);

                    byteArrays.push(byteArray);
                }

                var blob = new Blob(byteArrays, {type: contentType});
                return blob;
            }
            function savebase64AsPDF(folderpath,filename,content,contentType){
                // Convert the base64 string in a Blob
                var DataBlob = b64toBlob(content,contentType);
                
                console.log("Starting to write the file :3");
                
                window.resolveLocalFileSystemURL(folderpath, function(dir) {
                    console.log("Access to the directory granted succesfully");
                    dir.getDirectory('Fallas', { create: true }, function(dir2) {
                        dir2.getFile(filename, {create: true}, function(file) {
                            console.log("File created succesfully.");
                            file.createWriter(function(fileWriter) {
                                console.log("Writing content to file");
                                fileWriter.write(DataBlob);
                            }, function(){
                                alert('Unable to save file in path '+ folderpath);
                            });
                        });
                    })
                });
            }
            await this.loadDamages();
            for(var sample of this.samples) {
                var opts = {
                    documentSize: 'A4',
                    fileName: `PCI_${Moment().format("YYYY_MM_DD_hh_mm_ss")}_UM${sample.number}.pdf`,
                    type: 'base64'
                }
                var content = '<body style="font-size: 60px">'
                for (var damage of sample.damages) {
                    content += `
                        <div style="height: 1000px; padding: 50px">
                            <img style="width: 100%; min-height: 100px; max-height: 600px" src="${damage.image}">
                            <div style="margin-top: 20px">
                                <span style="font-weight: bold">
                                    Tipo:
                                </span>
                                <span>
                                    ${damage.type ? damage.type : ''}
                                </span>
                            </div>
                            <div>
                                <span style="font-weight: bold">
                                    Severidad:
                                </span>
                                <span>
                                    ${damage.severity ? ['', 'L', 'M', 'H'][damage.severity] : ''}
                                </span>
                            </div>
                            <div>
                                <span style="font-weight: bold">
                                    Cantidad:
                                </span>
                                <span>
                                    ${damage.amount ? damage.amount : ''}
                                </span>
                            </div>
                        </div>
                    `
                }
                content += '</html>'
                await pdf.fromData(content, opts)
                    .then((base64) => {
                        var contentType = "application/pdf";
                        var folderpath = cordova.file.externalRootDirectory + "Download/"; //you can select other folders
                        console.log(opts.fileName);
                        savebase64AsPDF(folderpath, opts.fileName, base64, contentType);  
                    })
                    .catch((error) => console.log(error));
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
}
.blue-card .el-card__body  {
    background-color: #2C39A994;
}
</style>