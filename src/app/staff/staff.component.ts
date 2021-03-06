import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  faCog,
  faEdit,
  faEllipsisH,
  faSearch,
  faSpinner,
  faTimes,
  faTrash,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { MessageboxResponse, ViewModes } from "../models/app-enums";
import { Staff } from "../models/staff.models";
import { MessageboxService } from "../services/messagebox.service";
import { NotificationService } from "../services/notification.service";
import { ProfilePopupService } from "../services/profile-popup.service";
import { StaffService } from "../services/staff.service";

@Component({
  selector: "app-staff",
  templateUrl: "./staff.component.html",
  styleUrls: ["./staff.component.css"],
})
export class StaffComponent implements OnInit {
  faSearch = faSearch;
  faEdit = faEdit;
  faTrash = faTrash;
  faSpinner = faSpinner;
  faTimes = faTimes;
  faCog = faCog;
  faEllipsisH = faEllipsisH;
  faUser = faUser;

  staffs: Staff[] = [];

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
  @Input()
  refreshStaffs = false;

  @Output()
  changeViewMode: EventEmitter<ViewModes> = new EventEmitter();

  @Output()
  refreshed: EventEmitter<Boolean> = new EventEmitter();

  staffProfile: Staff = new Staff();

  constructor(
    public staffService: StaffService,
    public notify: NotificationService,
    public messageBox: MessageboxService,
    public profilePopup: ProfilePopupService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(page = 1) {
    if (this.isLoading) return;
    this.isLoading = true;

    this.staffService.getAll(page, this.searchquery).subscribe(
      (response) => {
        if (response.result) {
          this.staffs = this.staffs.concat(response.result);
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
    this.staffs = [];
    this.loadData();
  }

  onViewProfile(staff: Staff) {
    let modalInstance = this.profilePopup.show(staff);
    modalInstance.result.then(() => {}).catch(() => {});
  }

  onBackToMain() {
    this.changeViewMode.emit(ViewModes.MainView);
    this.resetData();
  }
  onEdit(staff: Staff) {
    this.changeViewMode.emit(ViewModes.EditView);
    this.staffProfile = Object.assign({}, staff);
  }

  onNewItem(staff: Staff) {
    this.staffs.push(staff);
  }

  onUpdate(staff: Staff) {
    let index = this.staffs.findIndex((d) => d.id === staff.id);
    if (index > -1) {
      this.staffs.splice(index, 1, staff);
    }
  }

  onDelete(staff: Staff) {
    let modalInstance = this.messageBox.showWarning(
      `Are you sure you want to delete ${staff.surname}?`,
      "Delete Warning"
    );
    modalInstance.result
      .then((response: MessageboxResponse) => {
        if (response === MessageboxResponse.OK) {
          let tid = this.notify.showProcessing("Deleting user");
          this.staffService.delete(staff).subscribe(
            (response) => {
              if (response.success) {
                let index = this.staffs.findIndex((d) => d.id === staff.id);
                if (index > -1) this.staffs.splice(index, 1);
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
    this.staffProfile = new Staff();
  }

  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    if (this.refreshStaffs) {
      this.staffs = [];
      this.loadData();
      setTimeout(() => {
        this.refreshed.emit(true);
      }, 100);
    }
  }
}
