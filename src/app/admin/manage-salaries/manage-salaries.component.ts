import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  faCalculator,
  faChevronCircleLeft,
  faChevronCircleRight,
  faList,
  faListAlt,
  faPlusCircle,
  faPrint,
  faReceipt,
  faSignature,
  faThList,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { AppConfig } from "src/app/config/app-config";
import { ViewModes } from "src/app/models/app-enums";
import { ImageSnippet } from "src/app/models/ImageSnippet.model";
import { Payroll } from "src/app/models/payroll.models";
import { NotificationService } from "src/app/services/notification.service";
import { PayrollService } from "src/app/services/payroll.service";
import { SalaryService } from "src/app/services/salary.service";

@Component({
  selector: "app-manage-salaries",
  templateUrl: "./manage-salaries.component.html",
  styleUrls: ["./manage-salaries.component.css"],
})
export class ManageSalariesComponent implements OnInit {
  faList = faList;
  faPlusCircle = faPlusCircle;
  faTimes = faTimes;
  faThList = faThList;
  faListAlt = faListAlt;
  faPrint = faPrint;
  faChevronCircleLeft = faChevronCircleLeft;
  faSignature = faSignature;
  faReceipt = faReceipt;
  faCalculator = faCalculator;

  isEditMode: boolean;
  isMainMode: boolean;
  isNewItemMode: boolean;
  isBankScheduleMode: boolean;
  isPayslipMode: boolean;
  isSummaryMode: boolean;

  refreshSalaries: boolean;
  payrollId: number;
  payroll: Payroll = new Payroll(null);

  isCalculating = false;
  isProcessing = false;
  currentLabel = "Salaries";

  signature: ImageSnippet = null;

  constructor(
    public route: ActivatedRoute,
    public salaryService: SalaryService,
    public payrollService: PayrollService,
    public notify: NotificationService
  ) {}

  setViewMode(mode: ViewModes) {
    this.currentLabel = "Salaries";
    this.isEditMode = mode === ViewModes.EditView;
    this.isMainMode = mode === ViewModes.MainView;
    this.isNewItemMode = mode === ViewModes.NewItemView;
    this.isBankScheduleMode = mode === ViewModes.BankScheduleView;
    this.isPayslipMode = mode === ViewModes.PaymentSlipView;
    this.isSummaryMode = mode === ViewModes.SalarySummary;

    if (this.isBankScheduleMode) this.currentLabel = "Bank Schedule";
    if (this.isPayslipMode) this.currentLabel = "Staffs Payslips";
    if (this.isSummaryMode) this.currentLabel = "Salary Summary";
  }

  onBackToMain() {
    this.setViewMode(ViewModes.MainView);
  }

  calculateSalaries() {
    if (this.isCalculating) return;
    this.isCalculating = true;
    let tid = this.notify.showProcessing("calculating salaries");
    this.salaryService.calculateSalary({ payrollId: this.payrollId }).subscribe(
      (response) => {
        if (response.success) this.refreshSalaries = true;
      },
      (error) => {
        console.log(error);
      },
      () => {
        this.isCalculating = false;
        this.notify.hideProcessing(tid);
      }
    );
  }

  onRefreshed(status: boolean) {
    if (status) {
      this.refreshSalaries = false;
    }
  }

  generateBankSchedule() {}

  generatePaySlips() {}

  ngOnInit() {
    let mode = this.route.snapshot.params["mode"];
    if (mode === "new") {
      this.setViewMode(ViewModes.NewItemView);
    } else {
      this.setViewMode(ViewModes.MainView);
    }
    this.payrollId = this.route.snapshot.params.pid;

    this.payrollService.getPayroll(this.payrollId).subscribe(
      (response) => {
        if (response.success) {
          this.payroll = response.result;
        }
      },
      (reason) => {
        console.log(reason);
      }
    );
  }

  print(target: string) {
    AppConfig.print(target);
  }

  onFileChanged(imageInput) {
    let file: File = imageInput.files[0];
    let reader: FileReader = new FileReader();

    reader.addEventListener("load", (event) => {
      this.signature = new ImageSnippet(event.target["result"], file);
    });
    if (file instanceof Blob) {
      reader.readAsDataURL(file);
    }
  }
}
