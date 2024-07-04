import Vue from 'vue'
import { Button, Input, Image, Card, Row, Col } from 'element-ui'
import lang from 'element-ui/lib/locale/lang/es'
import locale from 'element-ui/lib/locale'
import 'element-ui/lib/theme-chalk/index.css';

locale.use(lang)

Vue.use(Button)
Vue.use(Input)
Vue.use(Image)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)

