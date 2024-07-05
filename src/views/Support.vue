<template>
    <div style="width: 90vw; margin: auto">
		<div class="page-title">
			SOPORTE
		</div>
		<div v-for="card in cards" :key="card.id" style="margin: 20px 0px">
			<el-card>
				<table style="width: 100%" >
					<tr>
						<th style="width: 80%; text-align: left">
							X
						</th>
						<th style="width: 20%">
							Y
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
					<tr>
						<td style="width: 80%; text-align: left">
							2. bbb
						</td>
						<td style="width: 20%">
							b
						</td>
					</tr>
					<tr>
						<td style="width: 80%; text-align: left">
							3. ccc
						</td>
						<td style="width: 20%">
							c
						</td>
					</tr>
				</table>
			</el-card>
		</div>
    </div>
</template>
<script>
export default {
  data() {
    return {
	  logo: require('../assets/images/logo.png'),
	  cards: []
    }
  },
  mounted() {
    console.log('Support');
	for(let i=0;i<10;i++) {
		this.cards.push({
			id: i
		});
	}
  }
}
</script>