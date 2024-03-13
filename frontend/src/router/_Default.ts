import { PageName } from '@/utils/_Constants';
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Mobile from '../views/Mobile.vue';
import MobileOverview from '../views/MobileOverview.vue';

const routes = [
  {
    path: '/',
    name: PageName.HOME,
    component: Home,
  },
  {
    path: '/mobile',
    name: PageName.MOBILE,
    component: MobileOverview,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
