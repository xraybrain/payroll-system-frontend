import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Miscellanous } from "../models/miscellanous.models";
import { Salary } from "../models/salary.models";
import { NotificationService } from "../services/notification.service";
import { SalaryService } from "../services/salary.service";

@Component({
  selector: "app-salary-form",
  templateUrl: "./salary-form.component.html",
  styleUrls: ["./salary-form.component.css"],
})
export class SalaryFormComponent implements OnInit {
  faSpinner = faSpinner;

  @Input()
  salary: Salary;

  @Output()
  salaryUpdate: EventEmitter<Salary> = new EventEmitter();

  formErrors: any = {
    title: null,
  };
  isProcessing = false;

  constructor(
    public salaryService: SalaryService,
    public notify: NotificationService
  ) {}

  generateMiscFromSalary() {
    let miscellanous: Miscellanous[] = [];
    for (let misc of this.salary.SalaryMiscellanous) {
      let m = new Miscellanous();
      m.amount = misc.subTotalAmount;
      m.id = misc.Miscellanou.id;
      m.category = misc.Miscellanou.category;
      miscellanous.push(m);
    }
    return miscellanous;
  }

  updateData() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    this.salary.Miscellanous = this.generateMiscFromSalary();

    this.salaryService.update(this.salary).subscribe(
      (response) => {
        this.formErrors = response.result || {};
        if (response.success) {
          this.notify.showSuccess(response.message, "success");
          this.salaryUpdate.emit(response.result);
        } else {
          this.notify.showError(response.message, "Operation failed");
        }
      },
      (reason) => {
        console.log(reason);
        this.notify.showError("Unable to contact server.", "Operation failed");
      },
      () => {
        this.isProcessing = false;
      }
    );
  }

  resetFormError() {
    this.formErrors = {
      title: null,
    };
  }

  resetProfile() {
    this.salary = new Salary(null, null, null);
  }

  ngOnInit() {}
}
