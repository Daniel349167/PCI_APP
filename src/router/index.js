import Vue from 'vue'
import Router from 'vue-router'
import Splash from '@/views/Splash'
import Login from '@/views/Login'
import Signup from '@/views/Signup'
import Home from '@/views/Home'
import Projects from '@/views/Projects'
import Results from '@/views/Results'
import Result from '@/views/Result'
import Support from '@/views/Support'
import Samples from '@/views/Samples'
import Surveys from '@/views/Surveys'
import Sheet from '@/views/Sheet'
import DamageLists from '@/views/DamageLists'
import DamageList from '@/views/DamageList'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Splash',
      component: Splash
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/projects',
      name: 'Projects',
      component: Projects
    },
    {
      path: '/results',
      name: 'Results',
      component: Results
    },
    {
      path: '/support',
      name: 'Support',
      component: Support
    },
    {
      path: '/projects/:project',
      name: 'Samples',
      component: Samples
    },
    {
      path: '/samples/:sample',
      name: 'Surveys',
      component: Surveys
    },
    {
      path: '/surveys/:survey',
      name: 'Sheet',
      component: Sheet
    },
    {
      path: '/results/:result',
      name: 'Result',
      component: Result
    },
    {
      path: '/damagelists/:project',
      name: 'DamageLists',
      component: DamageLists
    },
    {
      path: '/damagelist/:sample',
      name: 'DamageList',
      component: DamageList
    }
  ]
})