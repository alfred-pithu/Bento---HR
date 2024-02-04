import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ApplicantLoginComponent } from './applicant-login/applicant-login.component';
import { EmployeeLoginComponent } from './employee-login/employee-login.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
import { RegistrationSummaryComponent } from './registration-summary/registration-summary.component';
import { ApplicationsComponent } from './applications/applications.component';
import { ExperienceComponent } from './experience/experience.component';
import { SettingsComponent } from './settings/settings.component';
import { SkillsComponent } from './skills/skills.component';
import { AdminSummaryComponent } from './admin-summary/admin-summary.component';
import { PostJobComponent } from './post-job/post-job.component';
import { CreateEmployeeComponent } from './create-employee/create-employee.component';
import { ScheduleAdminComponent } from './schedule-admin/schedule-admin.component';
import { ApplicantTrackingComponent } from './applicant-tracking/applicant-tracking.component';
import { PayrollComponent } from './payroll/payroll.component';
import { authGuard } from './auth.guard';
import { DialogComponent } from './dialog/dialog.component';
import { PositionComponent } from './position/position.component';
import { ProfileLayoutComponent } from './profile-layout/profile-layout.component';
import { GraphComponent } from './graph/graph.component';
import { AvailabilityComponent } from './availability/availability.component';
import { AddressComponent } from './address/address.component';
import { TalentMarketComponent } from './talent-market/talent-market.component';
import { AuthRedirectComponent } from './auth-redirect/auth-redirect.component';
import { MapComponent } from './map/map.component';
import { HubComponent } from './hub/hub.component';
import { LiveTrackingComponent } from './live-tracking/live-tracking.component';
import { PointsComponent } from './points/points.component';

const routes: Routes = [
  { path: '', component: ApplicantLoginComponent },
  { path: 'auth-redirect', component: AuthRedirectComponent},
  { path: 'signup', component: SignUpComponent},
  { path: 'successful', component: DialogComponent},
  {
    path: 'admin',
    component: AdminSummaryComponent,
    children: [
      { path: 'createEmployee', component: CreateEmployeeComponent },
      {path: 'position/:employeeId', component: PositionComponent},
      { path: 'createSchedule', component: ScheduleAdminComponent },
      { path: 'jobs', component: PostJobComponent },
      { path: 'applicant', component: ApplicantTrackingComponent },
      { path: 'payroll', component: PayrollComponent },
      { path: 'graph', component: GraphComponent}
    ],
  },
  { 
    path: 'applicant/:applicantId',
    component: ProfileLayoutComponent,
    canActivate: [authGuard] ,
    children: [
      { path: 'profile/:applicantId', component: RegistrationSummaryComponent, canActivate: [authGuard] },
      { path: 'experience/:applicantId', component: ExperienceComponent, canActivate: [authGuard]  },
      { path: 'skills/:applicantId', component: SkillsComponent, canActivate: [authGuard]  },
      { path: 'applications/:applicantId', component: ApplicationsComponent, canActivate: [authGuard]  },
      { path: 'availability/:applicantId', component: AvailabilityComponent, canActivate: [authGuard]  },
      { path: 'settings/:applicantId', component: SettingsComponent, canActivate: [authGuard]  },
    ]
  },
  { path: 'address', component: AddressComponent},
  { path: 'jobs', component: TalentMarketComponent},
  { path: 'dashboard/:applicantId', component: DashboardComponent, canActivate: [authGuard]},
  { path: 'login', component: EmployeeLoginComponent},
  { path: 'success', component: SuccessDialogComponent},
  { path: 'map', component: MapComponent},
  { path: 'hub', component: HubComponent},
  { path: 'live', component: LiveTrackingComponent},
  { path: 'points', component: PointsComponent},
  { path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
