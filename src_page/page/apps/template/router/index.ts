import {createRouter, createWebHashHistory} from 'vue-router'

// import mainDesktop from '../pages/workbench/mainDesktop.vue'

const User = {
    template: '<div>User</div>',
  }

const routes = [
	{ path: '/', component: User },
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router