import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NotificationService } from "../services/notification.service";
import { SalaryService } from "../services/salary.service";

@Component({
  selector: "app-salary-summary",
  templateUrl: "./salary-summary.component.html",
  styleUrls: ["./salary-summary.component.css"],
})
export class SalarySummaryComponent implements OnInit {
  summary: any = {
    totalMiscellanous: [],
    totalStaffs: null,
    totalStaffsGroup: [],
    totalSalary: null,
  };
  payrollId = null;
  isLoading = false;
  constructor(
    public salaryService: SalaryService,
    public notify: NotificationService,
    public route: ActivatedRoute
  ) {
    this.payrollId = this.route.snapshot.params.pid;
  }

  ngOnInit() {
    this.isLoading = true;
    this.salaryService.getSummary(this.payrollId).subscribe(
      (response) => {
        if (response.success) {
          this.summary = response.result;
        } else {
          this.notify.showWarning(response.message, "Operation failed");
        }
      },
      (reason) => {
        console.log(reason);
        this.notify.showError("Failed to retrieve summary", "Operation failed");
        this.isLoading = false;
      },
      () => (this.isLoading = false)
    );
  }

  computeTotal(misc: any[]) {
    let total = 0.0;
    for (let item of misc) {
      total += parseFloat(item.total);
    }
    return total;
  }
}
