import {createRouter, createWebHashHistory} from 'vue-router'

import entryViewFileHistory from '../pages/workbench/entryViewFileHistory.vue'
import mainDesktop from '../pages/workbench/mainDesktop.vue'

const routes = [
	{ path: '/', component: entryViewFileHistory },
	{ path: '/main', component: mainDesktop },
]

const router = createRouter({
	history: createWebHashHistory(),
	routes,
})

export default router