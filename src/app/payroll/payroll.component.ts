import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  faCog,
  faEdit,
  faEllipsisH,
  faInfoCircle,
  faSearch,
  faSpinner,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { MessageboxResponse, PayrollStatus, ViewModes } from "../models/app-enums";
import { Payroll } from "../models/payroll.models";
import { MessageboxService } from "../services/messagebox.service";
import { NotificationService } from "../services/notification.service";
import { PayrollService } from "../services/payroll.service";

@Component({
  selector: "app-payroll",
  templateUrl: "./payroll.component.html",
  styleUrls: ["./payroll.component.css"],
})
export class PayrollComponent implements OnInit {
  faSearch = faSearch;
  faEdit = faEdit;
  faTrash = faTrash;
  faSpinner = faSpinner;
  faTimes = faTimes;
  faCog = faCog;
  faEllipsisH = faEllipsisH;
  faInfoCircle = faInfoCircle;

  payrolls: Payroll[] = [];

  isLoading = false;
  searchquery = "";
  hasMoreData = false;
  currentPage = 1;

  @Input()
  isMainMode = false;
  @Input()
  isEditMode = false;
  @Input()
  isNewItemMode = false;

  @Output()
  changeViewMode: EventEmitter<ViewModes> = new EventEmitter();

  payrollProfile: Payroll = new Payroll(null, null);

  constructor(
    public payrollService: PayrollService,
    public notify: NotificationService,
    public messageBox: MessageboxService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(page = 1) {
    if (this.isLoading) return;
    this.isLoading = true;

    this.payrollService.getAll(page, this.searchquery).subscribe(
      (response) => {
        if (response.result) {
          this.payrolls = this.payrolls.concat(response.result);
          this.hasMoreData = response.totalPages > response.currentPage;
          this.currentPage = Number(response.currentPage);
        } else {
          // notify
          this.notify.showWarning(response.message, "Loading Failed");
        }
      },
      (reason) => {
        this.notify.showError(
          "we encountered a problem while contacting server",
          "Operation failed"
        );
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onSearch() {
    this.payrolls = [];
    this.loadData();
  }

  onBackToMain() {
    this.changeViewMode.emit(ViewModes.MainView);
    this.resetData();
  }
  onEdit(payroll: Payroll) {
    this.changeViewMode.emit(ViewModes.EditView);
    this.payrollProfile = Object.assign({}, payroll);
  }
  onNewItem(payroll: Payroll) {
    this.payrolls.push(payroll);
  }

  onUpdate(payroll: Payroll) {
    let index = this.payrolls.findIndex((d) => d.id === payroll.id);
    if (index > -1) {
      this.payrolls.splice(index, 1, payroll);
    }
  }

  onDelete(payroll: Payroll) {
    let modalInstance = this.messageBox.showWarning(
      `Are you sure you want to delete ${payroll.title}?`,
      "Confirm Delete"
    );
    modalInstance.result
      .then((response: MessageboxResponse) => {
        if (response === MessageboxResponse.OK) {
          let tid = this.notify.showProcessing("Deleting");
          this.payrollService.delete(payroll).subscribe(
            (response) => {
              if (response.success) {
                let index = this.payrolls.findIndex((d) => d.id === payroll.id);
                if (index > -1) this.payrolls.splice(index, 1);
                this.notify.showSuccess(response.message, "Success");
              } else {
                this.notify.showWarning(response.message, "Operation failed");
              }
            },
            (reason) => {
              this.notify.showError(
                "we were unable to contact server.",
                "Operation failed"
              );
            },
            () => {
              this.notify.hideProcessing(tid);
            }
          );
        }
      })
      .catch((reason) => {});
  }

  getStatus(status: number){
    return PayrollStatus[status]
  }

  resetData() {
    this.payrollProfile = new Payroll(null, null);
  }
}
