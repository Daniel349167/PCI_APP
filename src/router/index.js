import Vue from 'vue'
import Router from 'vue-router'
import Splash from '@/views/Splash'
import Login from '@/views/Login'
import Signup from '@/views/Signup'
import Home from '@/views/Home'
import Projects from '@/views/Projects'
import Support from '@/views/Support'
import Samples from '@/views/Samples'
import Surveys from '@/views/Surveys'

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
      path: '/support',
      name: 'Support',
      component: Support
    },
    {
      path: '/projects/:sample',
      name: 'Samples',
      component: Samples
    },
    {
      path: '/projects/:sample/:survey',
      name: 'Surveys',
      component: Surveys
    }
  ]
})