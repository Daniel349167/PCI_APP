<template>
    <div style="width: 90vw; margin: auto">
		<BackButton/>
		<div class="page-title">
			SOPORTE
		</div>
		<div class="support-div">
			<el-card class="el-card-verde">
				<table>
					<tr>
						<th style="width: 80%; text-align: left">
							Código de daño
						</th>
						<th style="width: 20%; text-align: left">
							Unidad
						</th>
					</tr>
					<tr v-for="(item, index) in codes" :key="index">
						<td style="text-align: left; vertical-align: top;">
							{{index+1}}. {{item[0]}}
						</td>
						<td style="text-align: left; padding-left: 20px; vertical-align: top;">
							{{item[1]}}
						</td>
					</tr>
				</table>
			</el-card>
			<el-card class="el-card-verde">
				<table style="width: 100%" >
					<tr>
						<th style="text-align: left" colspan="2">
							Lista de símbolos
						</th>
					</tr>
					<tr v-for="(item, index) in symbols" :key="index">
						<td style="text-align: right; vertical-align: top;">
							{{item[0]}}:
						</td>
						<td style="text-align: left; vertical-align: top;">
							{{item[1]}}
						</td>
					</tr>
				</table>
			</el-card>
		</div>
		<Navbar/>
    </div>
</template>
<script>
import Navbar from '../components/Navbar.vue';
import BackButton from '../components/BackButton.vue';
export default {
  components: {
    Navbar,
	BackButton
  },
  data() {
    return {
        codes: [
            ['Grieta piel de cocodrilo', 'm²'],
            ['Exudación de asfalto', 'm²'],
            ['Grietas de contracción (bloque)', 'm²'],
            ['Flevaciones - Hundimientos', 'm²'],
            ['Corrugaciones', 'm²'],
            ['Depresiones', 'm²'],
            ['Grietas de borde', 'm'],
            ['Grietas de reflexión de juntas', 'm'],
            ['Desnivel de calzada - hombrillo', 'm'],
            ['Grietas longitudinales y transversales', 'm'],
            ['Parcheo', 'm²'],
            ['Agregados pulidos', 'm²'],
            ['Huecos', 'N°'],
            ['Accesos a puentes', 'm²'],
            ['Ahuellamiento', 'm²'],
            ['Deformación por empuje', 'm²'],
            ['Grietas de deslizamiento', 'm²'],
            ['Hinchamiento', 'm²'],
            ['Disgregación y Desintegración', 'm²']
        ],
        symbols: [
            ['UM', 'Unidad de Muestra'],
            ['L', 'Falla Leve'],
            ['M', 'Falla Media'],
            ['H', 'Falla Alta'],
            ['VD', 'Valor Deducido'],
            ['PCI', 'Índice de Condición de Pavimento'],
            ['L', 'Longitud de carretera'],
            ['A', 'Ancho de unidad de muestra'],
            ['l', 'Longitud de unidad de muestra']
        ]
    }
  },
  mounted() {
    console.log('Support');
  }
}
</script>
<style>
.support-div .el-card {
	margin: 20px 0px;
}
.support-div table {
	width: 100%;
}
.el-card-verde {
    border: 3px solid #28B065 !important; /* Un tono más oscuro que el fondo */
}
</style>