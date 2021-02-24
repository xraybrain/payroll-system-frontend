import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  faCog,
  faEdit,
  faEllipsisH,
  faSearch,
  faSpinner,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { MessageboxResponse, ViewModes } from "../models/app-enums";
import { Bank } from "../models/bank.models";
import { BankService } from "../services/bank.service";
import { MessageboxService } from "../services/messagebox.service";
import { NotificationService } from "../services/notification.service";

@Component({
  selector: "app-bank",
  templateUrl: "./bank.component.html",
  styleUrls: ["./bank.component.css"],
})
export class BankComponent implements OnInit {
  faSearch = faSearch;
  faEdit = faEdit;
  faTrash = faTrash;
  faSpinner = faSpinner;
  faTimes = faTimes;
  faCog = faCog;
  faEllipsisH = faEllipsisH;

  banks: Bank[] = [];

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

  bankProfile: Bank = new Bank(null, null);

  constructor(
    public bankService: BankService,
    public notify: NotificationService,
    public messageBox: MessageboxService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(page = 1) {
    if (this.isLoading) return;
    this.isLoading = true;

    this.bankService.getAll(page, this.searchquery).subscribe(
      (response) => {
        if (response.result) {
          this.banks = this.banks.concat(response.result);
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
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onSearch() {
    this.banks = [];
    this.loadData();
  }

  onBackToMain() {
    this.changeViewMode.emit(ViewModes.MainView);
    this.resetData();
  }
  onEdit(bank: Bank) {
    this.changeViewMode.emit(ViewModes.EditView);
    this.bankProfile = Object.assign({}, bank);
  }
  onNewItem(bank: Bank) {
    this.banks.push(bank);
  }

  onUpdate(bank: Bank) {
    let index = this.banks.findIndex((d) => d.id === bank.id);
    if (index > -1) {
      this.banks.splice(index, 1, bank);
    }
  }

  onDelete(bank: Bank) {
    let modalInstance = this.messageBox.showWarning(
      `Are you sure you want to delete ${bank.name}?`,
      "Confirm Delete"
    );
    modalInstance.result
      .then((response: MessageboxResponse) => {
        if (response === MessageboxResponse.OK) {
          let tid = this.notify.showProcessing("Deleting");
          this.bankService.delete(bank).subscribe(
            (response) => {
              if (response.success) {
                let index = this.banks.findIndex((d) => d.id === bank.id);
                if (index > -1) this.banks.splice(index, 1);
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

  resetData() {
    this.bankProfile = new Bank(null, null);
  }
}
