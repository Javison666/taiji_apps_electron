import { createRouter, createWebHashHistory } from 'vue-router'

import mainBench from '../pages/mainBench.vue'
import addEditChannel from '../pages/addEditChannel.vue'

const routes = [
	{ path: '/', component: mainBench },
	{ path: '/addEditChannel', component: addEditChannel }
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router
