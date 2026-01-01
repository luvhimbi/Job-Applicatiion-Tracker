import { Routes } from '@angular/router';
import {LoginComponent} from './login.component/login.component';
import {RegisterComponent} from './register.component/register.component';
import {DashboardComponent} from './dashboard.component/dashboard.component';
import {AuthGuard} from './guards/auth.guard';
import {AddApplicationComponent} from './add-application.component/add-application.component';
import {ProfileComponent} from './profile.component/profile.component';
import {JobDiscoveryComponent} from './job-discovery.component/job-discovery.component';;
import {ApplicationDetailsComponent} from './application-details.component/application-details.component';
import {ApplicationEditComponent} from './application-edit.component/application-edit.component';
import {RoleListComponent} from './role-list.component/role-list.component';
import {RoleDetailComponent} from './role-detail.component/role-detail.component';
import {NotFoundComponent} from './not-found.component/not-found.component';
import {LegalComponent} from './legal.component/legal.component';
import {OpportunitiesComponent} from './opportunities.component/opportunities.component';
import {SeederComponent} from './seeder.component';
import {AuthActionComponent} from './auth-action.component/auth-action-component';
import {AdminDashboardComponent} from './admin-dashboard.component/admin-dashboard.component';
import {AdminGuard} from './guards/admin.guard';

export const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path:'add-application', component: AddApplicationComponent, canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent ,canActivate: [AuthGuard] },
  {path:'JobSource',component:JobDiscoveryComponent, canActivate: [AuthGuard] },
  { path: 'application/:id', component: ApplicationDetailsComponent ,canActivate: [AuthGuard]},
  { path: 'application/edit/:id', component: ApplicationEditComponent, canActivate: [AuthGuard] }
  ,{ path: 'career-paths', component: RoleListComponent, canActivate: [AuthGuard] },
  { path: 'career-paths/:id', component: RoleDetailComponent,canActivate: [AuthGuard] },
  {
    path: 'opportunities',
    component: OpportunitiesComponent,
    title: 'Internships & Learnerships | Career Pipeline',
    canActivate: [AuthGuard]
  },
  {
    path: 'legal',
    component: LegalComponent,
    title: 'Legal - JobTracker'
  },
  { path: 'auth-action', component: AuthActionComponent },
  // Admin Routes
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] },
  // Utility (Database Seeder - remove in production)
  { path: 'admin/seed', component: SeederComponent },
  { path: '**', component: NotFoundComponent }
];
