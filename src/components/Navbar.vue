<template>
    <div>
        <div style="height: 12vw"/>
        <el-row id="navbar" style="
            text-align: center;
            width: 100%;
            position: fixed;
            bottom: 0;
            left: 0;
            padding-bottom: 5vw;
            padding-top: 2vw;
            font-size: 4vw;
            background-color: white;
        ">
            <el-col :span="6">
                <div @click="goto('home')">
                    <div>
                        <el-image :src="img.home" fit="contain" style="width: 10vw"/>
                    </div>
                    <div style="line-height: 0;">
                        Inicio
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div @click="goto('projects')">
                    <div>
                        <el-image :src="img.folder" fit="contain" style="width: 10vw"/>
                    </div>
                    <div style="line-height: 0;">
                        Proyectos
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div @click="goto('results')">
                    <div>
                        <el-image :src="img.chart" fit="contain" style="width: 10vw"/>
                    </div>
                    <div style="line-height: 0;">
                        Resultados
                    </div>
                </div>
            </el-col>
            <el-col :span="6">
                <div @click="goto('support')">
                    <div>
                        <el-image :src="img.flag" fit="contain" style="width: 10vw"/>
                    </div>
                    <div style="line-height: 0;">
                        Soporte
                    </div>
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>

export default {
  name: 'Navbar',
  data () {
    return {
        img: {
            home: require('../assets/images/home.png'),
            folder: require('../assets/images/folder.png'),
            chart: require('../assets/images/chart.png'),
            flag: require('../assets/images/flag.png')
        }
    }
  },
  methods: {
    goto(route) {
        switch(route) {
        case 'home':
        case 'projects':
        case 'support':
            this.$router.push(route);
        }
    }
  }
}
</script>