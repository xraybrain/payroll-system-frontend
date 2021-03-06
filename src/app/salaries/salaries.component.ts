import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  faCog,
  faEdit,
  faEllipsisH,
  faSearch,
  faSpinner,
  faTimes,
  faTrash,
  faFileExcel,
} from "@fortawesome/free-solid-svg-icons";
import { MessageboxResponse, ViewModes } from "../models/app-enums";
import { ExcelData } from "../models/excel-data";
import { Miscellanous } from "../models/miscellanous.models";
import { SalaryMisc } from "../models/salary-misc";
import { Salary } from "../models/salary.models";
import { ExportExcelService } from "../services/export-excel.service";
import { MessageboxService } from "../services/messagebox.service";
import { MiscellanousService } from "../services/miscellanous.service";
import { NotificationService } from "../services/notification.service";
import { SalaryService } from "../services/salary.service";

@Component({
  selector: "app-salaries",
  templateUrl: "./salaries.component.html",
  styleUrls: ["./salaries.component.css"],
})
export class SalariesComponent implements OnInit {
  faSearch = faSearch;
  faEdit = faEdit;
  faTrash = faTrash;
  faSpinner = faSpinner;
  faTimes = faTimes;
  faCog = faCog;
  faEllipsisH = faEllipsisH;
  faFileExcel = faFileExcel;

  salaries: Salary[] = [];
  salary: Salary = new Salary(null, null, null);

  isLoading = false;
  searchquery = "";
  hasMoreData = false;
  currentPage = 1;

  @Input()
  isMainMode = false;
  @Input()
  isEditMode = false;
  @Input()
  isNewItemMode = false;
  @Input()
  refreshSalaries = false;

  @Output()
  changeViewMode: EventEmitter<ViewModes> = new EventEmitter();

  @Output()
  refreshed: EventEmitter<Boolean> = new EventEmitter();

  salaryProfile: Salary = new Salary(null, null, null);
  payrollId = null;

  miscHeadings = [];

  constructor(
    public salaryService: SalaryService,
    public notify: NotificationService,
    public messageBox: MessageboxService,
    public route: ActivatedRoute,
    public miscService: MiscellanousService,
    public exportExcelService: ExportExcelService
  ) {}

  ngOnInit() {
    this.payrollId = this.route.snapshot.params.pid;
    this.loadData();

    this.miscService.getAll(1, "", false).subscribe(
      (response) => {
        if (response.success) {
          response.result.sort((a, b) => {
            return a.category - b.category;
          });
          for (let misc of response.result) {
            this.miscHeadings.push(misc.title.split(" ").join("_"));
          }
        }
      },
      (reason) => console.log(reason)
    );
  }

  loadData(page = 1) {
    if (this.isLoading) return;
    this.isLoading = true;

    this.salaryService.getAll(this.payrollId, page, this.searchquery).subscribe(
      (response) => {
        console.log(response);
        if (response.result) {
          this.salaries = this.salaries.concat(response.result);
          this.salaries.sort((a, b) => {
            let order = 0;
            if (a.Staff.surname.toLowerCase() > b.Staff.surname.toLowerCase())
              order = 1;
            if (a.Staff.surname.toLowerCase() < b.Staff.surname.toLowerCase())
              order = -1;
            return order;
          });
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

  onSearch() {
    this.salaries = [];
    this.loadData();
  }

  onBackToMain() {
    this.changeViewMode.emit(ViewModes.MainView);
    this.resetData();
  }

  onEdit(salary: Salary) {
    this.changeViewMode.emit(ViewModes.EditView);
    this.salary = JSON.parse(JSON.stringify(salary)); //Object.assign({}, salary);
  }
  onNewItem(salary: Salary) {
    this.salaries.push(salary);
  }

  onUpdate(salary: Salary) {
    let index = this.salaries.findIndex((d) => d.id === salary.id);
    if (index > -1) {
      this.salaries.splice(index, 1, salary);
    }
  }

  onDelete(salary: Salary) {
    let modalInstance = this.messageBox.showWarning(
      `Are you sure you want to delete ${salary.Staff.surname} ${salary.Staff.firstname} salary?`,
      "Confirm Delete"
    );
    modalInstance.result
      .then((response: MessageboxResponse) => {
        if (response === MessageboxResponse.OK) {
          let tid = this.notify.showProcessing("Deleting");
          this.salaryService.delete(salary).subscribe(
            (response) => {
              if (response.success) {
                let index = this.salaries.findIndex((d) => d.id === salary.id);
                if (index > -1) this.salaries.splice(index, 1);
                this.notify.showSuccess(response.message, "Success");
              } else {
                this.notify.showWarning(response.message, "Operation failed");
              }
            },
            (reason) => {
              this.notify.showError(
                "we were unable to contact server.",
                "Operation failed"
              );
            },
            () => {
              this.notify.hideProcessing(tid);
            }
          );
        }
      })
      .catch((reason) => {});
  }

  resetData() {
    this.salaryProfile = new Salary(null, null, null);
  }

  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (this.refreshSalaries) {
      this.salaries = [];
      this.loadData();
      setTimeout(() => {
        this.refreshed.emit(true);
      }, 100);
    }
  }

  normalizeMisc(salaryMisc: SalaryMisc[]) {
    let normalized: SalaryMisc[] = [];

    if (normalized.length < this.miscHeadings.length) {
      for (let title of this.miscHeadings) {
        let misc = salaryMisc.find(
          (d) => d.Miscellanou.title === title.split("_").join(" ")
        );
        if (!misc) {
          misc = new SalaryMisc(
            null,
            null,
            null,
            null,
            0,
            null,
            new Miscellanous(null, null, title)
          );
        }
        normalized.push(misc);
      }
      // normalized.sort((a, b) => {
      //   let order = 0;
      //   if (a.Miscellanou.title > b.Miscellanou.title) order = 1;
      //   if (a.Miscellanou.title < b.Miscellanou.title) order = -1;
      //   return order;
      // });
    }
    return normalized;
  }

  dateToString(date: string) {
    let d = new Date(date);
    return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
  }

  isProcessing = false;
  exportAsExcel() {
    if (this.isProcessing) return;
    let excelData = new ExcelData(
      `Imo State Polytechnic Staffs Salary`,
      [
        "Surname",
        "Firstname",
        "Othername",
        "Date Of Employment",
        "Department",
        "Designation",
        "Status",
        "Consolidated",
        ...this.miscHeadings,
        "Gross Pay",
        "Total Deductions",
        "Net Pay",
      ],
      []
    );
    for (let salary of this.salaries) {
      excelData.data.push([
        salary.Staff.surname,
        salary.Staff.firstname,
        salary.Staff.othername,
        this.dateToString(salary.Staff.dateOfEmp),
        salary.Staff.Department.name,
        salary.Staff.Designation.name,
        salary.status,
        salary.consolidated,
        ...this.normalizeMisc(salary.SalaryMiscellanous).map((d) =>
          parseFloat(`${d.subTotalAmount}`)
        ),
        parseFloat(`${salary.totalDeducted}`),
        parseFloat(`${salary.grossPay}`),
        parseFloat(`${salary.netPay}`),
      ]);
    }
    excelData.data.push([]);

    this.isProcessing = true;
    this.exportExcelService
      .exportExcel(excelData)
      .then(() => (this.isProcessing = false));
  }
}
