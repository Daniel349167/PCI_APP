<template>
    <div style="width: 90vw; margin: auto">
		<div class="page-title">
			PROYECTOS
		</div>
		<div v-for="project in projects" :key="project.id" style="margin: 20px 0px">
			<el-card>
				<el-row>
					<el-col :span="8">
						<el-image :src="project.image" fit="contain"/>
					</el-col>
					<el-col :span="16" style="text-align: left; padding: 0px 20px">
						<div>
							{{ project.name }}
						</div>
						<div style="color: white;">
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
export default {
  components: {
    Navbar
  },
  data() {
    return {
	  logo: require('../assets/images/logo.png'),
	  projects: []
    }
  },
  mounted() {
    console.log('Projects');
	for(let i=0;i<10;i++) {
		this.projects.push({
			id: i,
			image: 'https://i0.wp.com/sunrisedaycamp.org/wp-content/uploads/2020/10/placeholder.png',
			name: 'Proyecto ' + (i+1),
			time: 'fecha y hora'
		});
	}
  }
}
</script>