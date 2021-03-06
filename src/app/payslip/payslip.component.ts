import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppConfig } from "../config/app-config";
import { Salary } from "../models/salary.models";
import { MessageboxService } from "../services/messagebox.service";
import { NotificationService } from "../services/notification.service";
import { SalaryService } from "../services/salary.service";
import { MiscellanousType } from "../models/app-enums";
import { SalaryMisc } from "../models/salary-misc";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { ImageSnippet } from "../models/ImageSnippet.model";
@Component({
  selector: "app-payslip",
  templateUrl: "./payslip.component.html",
  styleUrls: ["./payslip.component.css"],
})
export class PayslipComponent implements OnInit {
  payrollId = null;
  isLoading = false;
  salaries: Salary[] = [];
  searchquery = "";
  hasMoreData = false;
  currentPage = 1;
  faSpinner = faSpinner;

  @Input('signature')
  signature: ImageSnippet;

  constructor(
    public salaryService: SalaryService,
    public notify: NotificationService,
    public messageBox: MessageboxService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.payrollId = this.route.snapshot.params.pid;
    this.loadData();
  }

  loadData(page = 1) {
    if (this.isLoading) return;
    this.isLoading = true;

    this.salaryService
      .getAll(this.payrollId, page, this.searchquery, false)
      .subscribe(
        (response) => {
          if (response.result) {
            this.salaries = this.salaries.concat(response.result);
            this.hasMoreData = response.totalPages > response.currentPage;
            this.currentPage = Number(response.currentPage);
          } else {
            // notify
            this.notify.showWarning(response.message, "Loading Failed");
          }
        },
        (reason) => {
          this.notify.showError(
            "we encountered a problem while contacting server",
            "Operation failed"
          );
        },
        () => {
          this.isLoading = false;
        }
      );
  }

  getSalaryMisc(miscType: MiscellanousType, misc: SalaryMisc[] = []) {
    let salaryMisc = [];

    for (let item of misc) {
      if (item.Miscellanou.category === miscType) {
        salaryMisc.push(item);
      }
    }

    return salaryMisc;
  }
}
