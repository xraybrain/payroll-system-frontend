import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { HttpClientModule } from "@angular/common/http";
import { ToastrModule } from "ngx-toastr";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { JwtModule } from "@auth0/angular-jwt";
import {
  NgChartjsModule,
  ɵa as StoreService,
  ɵb as PluginConfig,
} from "ng-chartjs";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { LoginComponent } from "./login/login.component";
import { AdminMainComponent } from "./admin/admin-main/admin-main.component";
import { AdminProfileComponent } from "./admin/admin-profile/admin-profile.component";
import { MessageboxComponent } from "./messagebox/messagebox.component";
import { ProfilePopupComponent } from "./profile-popup/profile-popup.component";
// import { RegisterComponent } from "./register/register.component";
// import { AccountProfileComponent } from "./account-profile/account-profile.component";
import { AdminDashboardComponent } from "./admin/admin-dashboard/admin-dashboard.component";
import { BankComponent } from "./bank/bank.component";
import { BankFormComponent } from "./bank-form/bank-form.component";
import { ManageBankComponent } from "./admin/manage-bank/manage-bank.component";
import { StaffComponent } from "./staff/staff.component";
import { StaffFormComponent } from "./staff-form/staff-form.component";
import { ManageStaffComponent } from "./admin/manage-staff/manage-staff.component";
import { ManagePayrollComponent } from "./admin/manage-payroll/manage-payroll.component";
import { ManageMiscellanousComponent } from "./admin/manage-miscellanous/manage-miscellanous.component";
import { ManageSalaryStructureComponent } from "./admin/manage-salary-structure/manage-salary-structure.component";
import { ManageDepartmentComponent } from "./admin/manage-department/manage-department.component";
import { MiscellanousComponent } from "./miscellanous/miscellanous.component";
import { MiscellanousFormComponent } from "./miscellanous-form/miscellanous-form.component";
import { PayrollComponent } from "./payroll/payroll.component";
import { PayrollFormComponent } from "./payroll-form/payroll-form.component";
import { DepartmentFormComponent } from "./department-form/department-form.component";
import { DepartmentComponent } from "./department/department.component";
import { DesignationFormComponent } from "./designation-form/designation-form.component";
import { SalaryStructureComponent } from "./salary-structure/salary-structure.component";
import { SalaryStructureFormComponent } from "./salary-structure-form/salary-structure-form.component";
import { SalariesComponent } from "./salaries/salaries.component";
import { SalaryFormComponent } from "./salary-form/salary-form.component";
import { ManageSalariesComponent } from "./admin/manage-salaries/manage-salaries.component";
import { BankScheduleComponent } from "./bank-schedule/bank-schedule.component";
import { PayslipComponent } from "./payslip/payslip.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { SalarySummaryComponent } from './salary-summary/salary-summary.component';
import { ResetPasswordModalComponent } from './reset-password-modal/reset-password-modal.component';

// this function retrieves the token
export function tokenGetter() {
  return localStorage.getItem("access_token");
}

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AdminMainComponent,
    AdminProfileComponent,
    MessageboxComponent,
    ProfilePopupComponent,
    // RegisterComponent,
    // AccountProfileComponent,
    AdminDashboardComponent,
    BankComponent,
    BankFormComponent,
    ManageBankComponent,
    StaffComponent,
    StaffFormComponent,
    ManageStaffComponent,
    ManagePayrollComponent,
    ManageMiscellanousComponent,
    ManageSalaryStructureComponent,
    ManageDepartmentComponent,
    MiscellanousComponent,
    MiscellanousFormComponent,
    PayrollComponent,
    PayrollFormComponent,
    DepartmentFormComponent,
    DepartmentComponent,
    DesignationFormComponent,
    SalaryStructureComponent,
    SalaryStructureFormComponent,
    SalariesComponent,
    SalaryFormComponent,
    ManageSalariesComponent,
    BankScheduleComponent,
    PayslipComponent,
    ForgotPasswordComponent,
    SalarySummaryComponent,
    ResetPasswordModalComponent,
  ],
  entryComponents: [MessageboxComponent, ProfilePopupComponent, ResetPasswordModalComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    FontAwesomeModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      progressBar: true,
      timeOut: 5000,
      maxOpened: 1,
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ["localhost:4100"],
        disallowedRoutes: ["localhost:4100/api/auth/"],
      },
    }),
    NgbModule,
    NgChartjsModule,
  ],
  providers: [StoreService, PluginConfig],
  bootstrap: [AppComponent],
})
export class AppModule {}
