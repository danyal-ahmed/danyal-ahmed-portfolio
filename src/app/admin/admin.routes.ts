// src/app/admin/admin.routes.ts
import { Routes } from '@angular/router';
import { authGuard } from '../core/auth/auth.guard';
import { AdminLogin } from './login/login';
import { AdminLayout } from './layout/admin-layout';
import { ProjectsAdmin } from './projects/projects-admin';
import { HomeEditor } from './home/home-editor';
import { AboutEditor } from './about/about-editor';
import { MessagesList } from './messages/messages-list';
import { Project } from './projects/Project';

export const ADMIN_ROUTES: Routes = [
  // Unprotected Login Route
  { path: 'login', component: AdminLogin },

  // Protected Admin Layout Area
  {
    path: '',
    component: AdminLayout,
    canActivate: [authGuard], // <--- Applies the guard to all children
    children: [
      { path: '', redirectTo: 'projects', pathMatch: 'full' },
      { path: 'projects', component: ProjectsAdmin },
      { path: 'projects/new', component: Project },
      { path: 'projects/edit/:id', component: Project },
      { path: 'home-content', component: HomeEditor },
      { path: 'about-content', component: AboutEditor },
      { path: 'messages', component: MessagesList },
    ],
  },
];
