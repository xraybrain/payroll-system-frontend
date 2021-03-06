import { Injectable } from "@angular/core";
import {
  NgbActiveModal,
  NgbModal,
  NgbModalRef,
} from "@ng-bootstrap/ng-bootstrap";
import { MessageboxComponent } from "../messagebox/messagebox.component";
import { MessageboxType } from "../models/app-enums";

@Injectable({
  providedIn: "root",
})
export class MessageboxService {
  constructor(private modal: NgbModal) {}

  createModal(
    message: string,
    title: string,
    type: MessageboxType
  ): NgbModalRef {
    let modalInstance = this.modal.open(MessageboxComponent, { size: "md" });
    modalInstance.componentInstance.settings = {
      message,
      title,
      type,
    };

    return modalInstance;
  }

  showWarning(message: string, title = "Warning"): NgbModalRef {
    return this.createModal(message, title, MessageboxType.WARNING);
  }

  showSuccess(message: string, title = "Success"): NgbModalRef {
    return this.createModal(message, title, MessageboxType.SUCCESS);
  }

  showInfo(message: string, title = "Information"): NgbModalRef {
    return this.createModal(message, title, MessageboxType.INFO);
  }
}
