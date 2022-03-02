import { createRouter, createWebHashHistory } from 'vue-router'

import mainBench from '../pages/mainBench.vue'
import addEditItem from '../pages/addEditItem.vue'
import background from '../pages/background.vue'

const routes = [
	{ path: '/', component: mainBench },
	{ path: '/addEditItem', component: addEditItem },
	{ path: '/background', component: background }
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
