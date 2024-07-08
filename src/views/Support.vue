<template>
    <div style="width: 90vw; margin: auto">
		<div class="page-title">
			SOPORTE
		</div>
		<div style="margin: 20px 0px">
			<el-card>
				<table style="width: 100%" >
					<tr>
						<th style="width: 80%; text-align: left">
							Código de daño
						</th>
						<th style="width: 20%">
							Unidad
						</th>
					</tr>
					<tr>
						<td style="width: 80%; text-align: left">
							1. aaa
						</td>
						<td style="width: 20%">
							a
						</td>
					</tr>
				</table>
			</el-card>
			<el-card>
				<table style="width: 100%" >
					<tr>
						<th style="text-align: left" colspan="2">
							Lista de símbolos
						</th>
					</tr>
					<tr>
						<td style="width: 80%; text-align: left">
							1. bbb
						</td>
						<td style="width: 20%">
							b
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
export default {
  components: {
    Navbar
  },
  data() {
    return {
	  logo: require('../assets/images/logo.png'),
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
            ['PCI', 'Índice de Condición de Pavimento']
        ]
    }
  },
  mounted() {
    console.log('Support');
	for(let i=0;i<2;i++) {
		this.cards.push({
			id: i
		});
	}
  }
}
</script>