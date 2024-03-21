import { PageName } from '@/utils/_Constants';
import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Mobile from '../views/Mobile.vue';
import MobileVoting from '../views/MobileVoting.vue';

const routes = [
  {
    path: '/',
    name: PageName.HOME,
    component: Home,
  },
  {
    path: '/mobile/cafe',
    name: PageName.MOBILE_CAFE,
    component: MobileVoting,
    props: { presetImages: ['cafe_1', 'cafe_2'], location: 'cafe' },
  },
  {
    path: '/mobile/student',
    name: PageName.MOBILE_STUDENT,
    component: MobileVoting,
    props: { presetImages: ['student_1', 'student_2'], location: 'student' },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;
