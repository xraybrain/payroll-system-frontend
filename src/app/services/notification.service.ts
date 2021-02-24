import { Injectable } from "@angular/core";
import { NgbToast } from "@ng-bootstrap/ng-bootstrap";
import { ToastrService } from "ngx-toastr";

@Injectable({
  providedIn: "root",
})
export class NotificationService {
  constructor(private toastr: ToastrService) {}

  activeProcess = [];

  showSuccess(message: string, title: string) {
    this.toastr.success(message, title);
  }
  showError(message: string, title: string) {
    this.toastr.error(message, title);
  }
  showInfo(message: string, title: string) {
    this.toastr.info(message, title);
  }
  showWarning(message: string, title: string) {
    this.toastr.warning(message, title);
  }

  showProcessing(message: string) {
    let active = this.toastr.info(message + "...", "", {
      timeOut: 0,
      progressAnimation: "increasing",
    });
    return active.toastId;
  }

  hideProcessing(id: number) {
    this.toastr.remove(id);
  }
}
