import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppConfig } from "../config/app-config";
import { Salary } from "../models/salary.models";
import { MessageboxService } from "../services/messagebox.service";
import { NotificationService } from "../services/notification.service";
import { SalaryService } from "../services/salary.service";
import { ToWords } from "to-words";

@Component({
  selector: "app-bank-schedule",
  templateUrl: "./bank-schedule.component.html",
  styleUrls: ["./bank-schedule.component.css"],
})
export class BankScheduleComponent implements OnInit {
  payrollId = null;
  isLoading = false;
  bankSchedule: any[] = [];
  searchquery = "";
  hasMoreData = false;
  currentPage = 1;

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
            this.bankSchedule = this.bankSchedule.concat(
              this.normalize(response.result)
            );
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

  normalize(salaries: Salary[]) {
    let normalized: { Salaries: Salary[]; Bank: string }[] = [];
    let bank: number;
    let group: { Salaries: Salary[]; Bank: string } = {
      Salaries: [],
      Bank: null,
    };

    for (let salary of salaries) {
      if (bank === salary.bankId) {
        group.Salaries.push(salary);
      } else {
        if (group.Salaries.length > 0 && group.Bank) {
          normalized.push(group);
        }
        group = {
          Salaries: [salary],
          Bank: salary.Staff.Bank.name,
        };
        bank = salary.bankId;
      }
    }
    if (group.Salaries.length > 0 && group.Bank) {
      normalized.push(group);
    }

    return normalized;
  }

  calculateTotal(salaries: Salary[]) {
    let total = 0;
    for (let salary of salaries) {
      total += Number(salary.netPay);
    }
    return total;
  }

  amountInWords(amount: number) {
    let toWords = new ToWords({
      localeCode: "en-US",
      converterOptions: { ignoreZeroCurrency: true, currency: true },
    });

    let words = toWords.convert(amount);
    if (words)
      words = words
        .replace(/dollars|dollar/i, "Naira")
        .replace(/cents|cent/i, "kobo");

    return words;
  }

  print(target: string) {
    AppConfig.print(target);
  }
}
