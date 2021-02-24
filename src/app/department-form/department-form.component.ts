import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Department } from '../models/department.models';
import { DepartmentService } from '../services/department.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-department-form',
  templateUrl: './department-form.component.html',
  styleUrls: ['./department-form.component.css']
})
export class DepartmentFormComponent implements OnInit {

  faSpinner = faSpinner;

  @Input()
  isNewItemMode: boolean;
  @Input()
  isEditMode: boolean;
  @Input()
  deptProfile: Department;

  @Output()
  newItem: EventEmitter<Department> = new EventEmitter();

  @Output()
  itemUpdate: EventEmitter<Department> = new EventEmitter();

  formErrors: any = {
    name: null,
  };
  isProcessing = false;

  constructor(
    public deptService: DepartmentService,
    public notify: NotificationService
  ) {}

  saveData() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.deptService.save(this.deptProfile).subscribe(
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

    this.deptService.update(this.deptProfile).subscribe(
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
      name: null,
    };
  }

  resetProfile() {
    this.deptProfile = new Department(null, null);
  }

  ngOnInit() {}

}
