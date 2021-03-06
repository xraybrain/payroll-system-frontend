import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { AppConfig } from "../config/app-config";
import { Salary } from "../models/salary.models";
import { MessageboxService } from "../services/messagebox.service";
import { NotificationService } from "../services/notification.service";
import { SalaryService } from "../services/salary.service";
import { ToWords } from "to-words";
import { ExportExcelService } from "../services/export-excel.service";
import { ExcelData } from "../models/excel-data";
import { BankSchedule } from "../models/bank-schedule.models";
import { faFileExcel, faSpinner } from "@fortawesome/free-solid-svg-icons";

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

  faSpinner = faSpinner;
  faFileExcel = faFileExcel;

  constructor(
    public salaryService: SalaryService,
    public notify: NotificationService,
    public messageBox: MessageboxService,
    public route: ActivatedRoute,
    public exportExcelService: ExportExcelService
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
      if (salary.Staff.Bank) {
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

  isProcessing = false;
  exportAsExcel(schedule: { Salaries: Salary[]; Bank: string }) {
    if (this.isProcessing) return;
    let excelData = new ExcelData(
      `${schedule.Bank} - Imo State Polytechnic Staff Salary Schedule`,
      ["Surname", "Firstname", "Othername", "Account No", "Salary"],
      []
    );
    for (let salary of schedule.Salaries) {
      excelData.data.push([
        salary.Staff.surname,
        salary.Staff.firstname,
        salary.Staff.othername,
        salary.Staff.accountNo,
        salary.netPay,
      ]);
    }
    excelData.data.push([]);
    excelData.data.push([
      this.amountInWords(this.calculateTotal(schedule.Salaries)),
    ]);

    this.isProcessing = true;
    this.exportExcelService
      .exportExcel(excelData)
      .then(() => (this.isProcessing = false));
  }
}
