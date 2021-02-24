import { Injectable } from "@angular/core";
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Staff } from "../models/staff.models";
import { ProfilePopupComponent } from "../profile-popup/profile-popup.component";

@Injectable({
  providedIn: "root",
})
export class ProfilePopupService {
  constructor(private modal: NgbModal) {}

  show(staff: Staff): NgbModalRef {
    let modalRef = this.modal.open(ProfilePopupComponent, { size: "lg" });
    modalRef.componentInstance.staff = staff;
    return modalRef;
  }
}
