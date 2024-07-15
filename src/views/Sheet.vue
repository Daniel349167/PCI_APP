<template>
    <div style="width: 90vw; margin: auto">
		<div class="page-title">
			Daño {{ $route.params.survey }}
		</div>
        <div style="height: 20px" />
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="Tipo (1-19)">
                <el-input v-model="form.type" type="number"></el-input>
            </el-form-item>
            <el-form-item label="Severidad">
                <el-input v-model="form.severity" type="number"></el-input>
            </el-form-item>
            <el-form-item label="Cantidad">
                <el-input v-model="form.amount" type="number"></el-input>
            </el-form-item>
        </el-form>
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
    }
}
</script>