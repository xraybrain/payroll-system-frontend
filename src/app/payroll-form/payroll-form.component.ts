import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Payroll } from '../models/payroll.models';
import { NotificationService } from '../services/notification.service';
import { PayrollService } from '../services/payroll.service';

@Component({
  selector: 'app-payroll-form',
  templateUrl: './payroll-form.component.html',
  styleUrls: ['./payroll-form.component.css']
})
export class PayrollFormComponent implements OnInit {

  faSpinner = faSpinner;

  @Input()
  isNewItemMode: boolean;
  @Input()
  isEditMode: boolean;
  @Input()
  payrollProfile: Payroll;

  @Output()
  newItem: EventEmitter<Payroll> = new EventEmitter();

  @Output()
  itemUpdate: EventEmitter<Payroll> = new EventEmitter();

  formErrors: any = {
    title: null,
  };
  isProcessing = false;

  constructor(
    public payrollService: PayrollService,
    public notify: NotificationService
  ) {}

  saveData() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    this.payrollService.save(this.payrollProfile).subscribe(
      (response) => {
        this.isProcessing = false;
        if (response.success) {
          this.newItem.emit(response.result);
          this.notify.showSuccess(response.message, "Success");
          this.resetFormError();
          this.resetProfile();
        } else {
          this.notify.showWarning(response.message, "Operation failed");
          console.log(response);
          this.formErrors = response.result || this.resetFormError();
        }
      },
      (reason) => {
        console.log(reason);
        this.notify.showError(
          "We encountered error while contacting server.",
          "Operation failed"
        );
      }
    );
  }

  updateData() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    this.payrollService.update(this.payrollProfile).subscribe(
      (response) => {
        this.formErrors = response.result || {};
        if (response.success) {
          this.notify.showSuccess(response.message, "success");
          this.itemUpdate.emit(response.result);
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
    this.payrollProfile = new Payroll(null, null);
  }

  ngOnInit() {}

}
