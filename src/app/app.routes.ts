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
import {SeedCareersComponent} from './seed-careers.component';

export const routes: Routes = [
  { path: '', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {path:'add-application', component: AddApplicationComponent, canActivate: [AuthGuard]},
  { path: 'profile', component: ProfileComponent ,canActivate: [AuthGuard] },
  {path:'JobSource',component:JobDiscoveryComponent, canActivate: [AuthGuard] },
  { path: 'application/:id', component: ApplicationDetailsComponent ,canActivate: [AuthGuard]},
  { path: 'application/edit/:id', component: ApplicationEditComponent, canActivate: [AuthGuard] }
  ,{ path: 'career-paths', component: RoleListComponent },
  { path: 'career-paths/:id', component: RoleDetailComponent },

  // Utility (Database Seeder - remove in production)
  { path: 'admin/seed', component: SeedCareersComponent },
];
