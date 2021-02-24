import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginComponent } from "./login/login.component";
import { AdminMainComponent } from "./admin/admin-main/admin-main.component";
// import { RegisterComponent } from "./register/register.component";
import { AuthGuard } from "./auth.guard";
import { AdminDashboardComponent } from "./admin/admin-dashboard/admin-dashboard.component";
import { ManageBankComponent } from "./admin/manage-bank/manage-bank.component";
import { ManageMiscellanousComponent } from "./admin/manage-miscellanous/manage-miscellanous.component";
import { ManageDepartmentComponent } from "./admin/manage-department/manage-department.component";
import { ManageStaffComponent } from "./admin/manage-staff/manage-staff.component";
import { ManageSalaryStructureComponent } from "./admin/manage-salary-structure/manage-salary-structure.component";
import { ManagePayrollComponent } from "./admin/manage-payroll/manage-payroll.component";
import { ManageSalariesComponent } from "./admin/manage-salaries/manage-salaries.component";
import { AdminProfileComponent } from "./admin/admin-profile/admin-profile.component";

import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
const routes: Routes = [
  {
    path: "",
    component: LoginComponent,
  },
  {
    path: "login",
    component: LoginComponent,
  },
  // {
  //   path: "register",
  //   component: RegisterComponent,
  // },
  {
    path: "forgotten/password",
    component: ForgotPasswordComponent,
  },
  {
    path: "admin",
    redirectTo: "admin/dashboard",
  },
  {
    path: "admin/banks",
    redirectTo: "admin/banks/view",
  },
  {
    path: "admin/miscellanous",
    redirectTo: "admin/miscellanous/view",
  },
  {
    path: "admin/departments",
    redirectTo: "admin/departments/view",
  },
  {
    path: "admin/staffs",
    redirectTo: "admin/staffs/view",
  },
  {
    path: "admin/salary/structures",
    redirectTo: "admin/salary/structures/view",
  },
  {
    path: "admin/payrolls",
    redirectTo: "admin/payrolls/view",
  },
  {
    path: "admin",
    component: AdminMainComponent,
    canActivate: [AuthGuard],
    children: [
      { path: "dashboard", component: AdminDashboardComponent },
      { path: "banks/:mode", component: ManageBankComponent },
      { path: "miscellanous/:mode", component: ManageMiscellanousComponent },
      { path: "departments/:mode", component: ManageDepartmentComponent },
      { path: "staffs/:mode", component: ManageStaffComponent },
      {
        path: "salary/structures/:mode",
        component: ManageSalaryStructureComponent,
      },
      {
        path: "payrolls/:mode",
        component: ManagePayrollComponent,
      },
      {
        path: "payroll/salaries/:pid",
        component: ManageSalariesComponent,
      },
      { path: "profile", component: AdminProfileComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
