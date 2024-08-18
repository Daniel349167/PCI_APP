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
import Damages from '@/views/Damages'
import Sheet from '@/views/Sheet'
import DamageLists from '@/views/DamageLists'
import DamageList from '@/views/DamageList'
import Summaries from '@/views/Summaries'
import MeteringSummary from '@/views/MeteringSummary'
import DeductValuesSummary from '@/views/DeductValuesSummary'
import PCISummary from '@/views/PCISummary'

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
      name: 'Damages',
      component: Damages
    },
    {
      path: '/damages/:damage',
      name: 'Sheet',
      component: Sheet
    },
    {
      path: '/results/:project',
      name: 'Result',
      component: Result
    },
    {
      path: '/damagelists/:project',
      name: 'DamageLists',
      component: DamageLists
    },
    {
      path: '/damagelists/:project/:sample',
      name: 'DamageList',
      component: DamageList
    },
    {
      path: '/summaries/metering/:project',
      name: 'Summaries',
      component: Summaries
    },
    {
      path: '/summaries/deduct/:project',
      name: 'Summaries',
      component: Summaries
    },
    {
      path: '/summaries/metering/:project/:sample',
      name: 'MeteringSummary',
      component: MeteringSummary
    },
    {
      path: '/summaries/deduct/:project/:sample',
      name: 'DeductValuesSummary',
      component: DeductValuesSummary
    },
    {
      path: '/summaries/pci/:project',
      name: 'PCISummary',
      component: PCISummary
    }
  ]
})