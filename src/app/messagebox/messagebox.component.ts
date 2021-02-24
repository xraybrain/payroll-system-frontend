import { Component, OnInit } from "@angular/core";
import {
  faCheckCircle,
  faExclamation,
  faExclamationTriangle,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { MessageboxResponse } from "../models/app-enums";

@Component({
  selector: "app-messagebox",
  templateUrl: "./messagebox.component.html",
  styleUrls: ["./messagebox.component.css"],
})
export class MessageboxComponent implements OnInit {
  constructor(private modalInstance: NgbActiveModal) {}
  faExclamationTriangle = faExclamationTriangle;
  faCheckCircle = faCheckCircle;
  faInfoCircle = faInfoCircle;
  settings: { type: number, title: string, message: string };

  ngOnInit() {}

  ok() {
    this.modalInstance.close(MessageboxResponse.OK);
  }

  cancel() {
    this.modalInstance.close(MessageboxResponse.CANCEL);
  }

  close() {
    this.modalInstance.close(MessageboxResponse.CLOSE);
  }
}
