import { Component, OnInit } from "@angular/core";
import { faIdCard, faTimes } from "@fortawesome/free-solid-svg-icons";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Staff } from "../models/staff.models";

@Component({
  selector: "app-profile-popup",
  templateUrl: "./profile-popup.component.html",
  styleUrls: ["./profile-popup.component.css"],
})
export class ProfilePopupComponent implements OnInit {
  faTimes = faTimes;
  faIdCard = faIdCard;
  staff: Staff;

  constructor(private modalInstance: NgbActiveModal) {}

  ngOnInit() {}

  close() {
    this.modalInstance.close(0);
  }
}
