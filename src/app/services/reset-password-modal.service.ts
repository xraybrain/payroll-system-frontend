import { Injectable } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ResetPasswordModalComponent } from "../reset-password-modal/reset-password-modal.component";

@Injectable({
  providedIn: "root",
})
export class ResetPasswordModalService {
  constructor(private modal: NgbModal) {}

  show() {
    let modalInstance = this.modal.open(ResetPasswordModalComponent, {
      size: "sm",
    });
    modalInstance.result.then(() => {}).catch(() => {});
  }
}
