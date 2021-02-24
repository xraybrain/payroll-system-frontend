import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { Bank } from "../models/bank.models";
import { BankService } from "../services/bank.service";
import { NotificationService } from "../services/notification.service";

@Component({
  selector: "app-bank-form",
  templateUrl: "./bank-form.component.html",
  styleUrls: ["./bank-form.component.css"],
})
export class BankFormComponent implements OnInit {
  faSpinner = faSpinner;

  @Input()
  isNewItemMode: boolean;
  @Input()
  isEditMode: boolean;
  @Input()
  bankProfile: Bank;

  @Output()
  newItem: EventEmitter<Bank> = new EventEmitter();

  @Output()
  itemUpdate: EventEmitter<Bank> = new EventEmitter();

  formErrors: any = {
    name: null,
  };
  isProcessing = false;

  constructor(
    public bankService: BankService,
    public notify: NotificationService
  ) {}

  saveData() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    this.bankService.save(this.bankProfile).subscribe(
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

    this.bankService.update(this.bankProfile).subscribe(
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
    this.bankProfile = new Bank(null, null);
  }

  ngOnInit() {}
}
