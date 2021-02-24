import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Miscellanous } from "../models/miscellanous.models";
import { AppService } from "../services/app.service";
import { MiscellanousService } from "../services/miscellanous.service";
import { NotificationService } from "../services/notification.service";

@Component({
  selector: "app-miscellanous-form",
  templateUrl: "./miscellanous-form.component.html",
  styleUrls: ["./miscellanous-form.component.css"],
})
export class MiscellanousFormComponent implements OnInit {
  faSpinner = faSpinner;

  @Input()
  isNewItemMode: boolean;
  @Input()
  isEditMode: boolean;
  @Input()
  miscProfile: Miscellanous;

  @Output()
  newItem: EventEmitter<Miscellanous> = new EventEmitter();

  @Output()
  itemUpdate: EventEmitter<Miscellanous> = new EventEmitter();

  formErrors: any;
  isProcessing = false;

  levels = [];
  grades = [];
  staffClasses = [];

  constructor(
    public miscService: MiscellanousService,
    public appService: AppService,
    public notify: NotificationService
  ) {
    this.resetFormError();
  }

  saveData() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    this.miscService.save(this.miscProfile).subscribe(
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

    this.miscService.update(this.miscProfile).subscribe(
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
      amount: null,
      derivedFrom: null,
      category: null,
      level: null,
      classId: null,
      isCalculated: false,
      genderRestricted: null,
    };
  }

  resetProfile() {
    this.miscProfile = new Miscellanous(null, null, null, null, null);
  }

  ngOnInit() {
    this.appService.getLevels().subscribe(
      (response) => {
        this.levels = response.result;
      },
      (reason) => {
        console.log(reason);
      }
    );

    this.appService.getGrades().subscribe(
      (response) => {
        this.grades = response.result;
      },
      (reason) => {
        console.log(reason);
      }
    );

    this.appService.getStaffClasses().subscribe(
      (response) => {
        this.staffClasses = response.result;
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
}
