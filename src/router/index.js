import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import PublicLayout from '../layouts/PublicLayout.vue'
import AdminLayout from '../layouts/AdminLayout.vue'

import Home from '../views/Home.vue'
import Projects from '../views/Projects.vue'
import ProjectDetail from '../views/ProjectDetail.vue'
import Skills from '../views/Skills.vue'
import Contact from '../views/Contact.vue'

import AdminLogin from '../views/admin/Login.vue'
import AdminDashboard from '../views/admin/Dashboard.vue'
import AdminProfile from '../views/admin/ProfileEditor.vue'
import AdminProjects from '../views/admin/ProjectsManager.vue'
import AdminSkills from '../views/admin/SkillsManager.vue'
import AdminMessages from '../views/admin/Messages.vue'

const routes = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      { path: '', name: 'home', component: Home },
      { path: 'projects', name: 'projects', component: Projects },
      { path: 'projects/:slug', name: 'project-detail', component: ProjectDetail },
      { path: 'skills', name: 'skills', component: Skills },
      { path: 'contact', name: 'contact', component: Contact },
    ],
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: AdminLogin,
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', name: 'admin-dashboard', component: AdminDashboard },
      { path: 'profile', name: 'admin-profile', component: AdminProfile },
      { path: 'projects', name: 'admin-projects', component: AdminProjects },
      { path: 'skills', name: 'admin-skills', component: AdminSkills },
      { path: 'messages', name: 'admin-messages', component: AdminMessages },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'admin-login', query: { redirect: to.fullPath } }
  }

  if (to.name === 'admin-login' && auth.isAuthenticated) {
    return { name: 'admin-dashboard' }
  }

  return true
})

export default router
