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
import { Department } from "../models/department.models";
import { Designation } from "../models/designation.models";
import { DepartmentService } from "../services/department.service";
import { DesignationService } from "../services/designation.service";
import { MessageboxService } from "../services/messagebox.service";
import { NotificationService } from "../services/notification.service";

@Component({
  selector: "app-department",
  templateUrl: "./department.component.html",
  styleUrls: ["./department.component.css"],
})
export class DepartmentComponent implements OnInit {
  faSearch = faSearch;
  faEdit = faEdit;
  faTrash = faTrash;
  faSpinner = faSpinner;
  faTimes = faTimes;
  faCog = faCog;
  faEllipsisH = faEllipsisH;

  departments: Department[] = [];

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

  deptProfile: Department = new Department(null, null);
  dsgProfile: Designation = new Designation(null, null);

  tempItem: any;

  isProcessing = false;

  constructor(
    public deptService: DepartmentService,
    public dsgService: DesignationService,
    public notify: NotificationService,
    public messageBox: MessageboxService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(page = 1) {
    if (this.isLoading) return;
    this.isLoading = true;

    this.deptService.getAll(page, this.searchquery).subscribe(
      (response) => {
        if (response.result) {
          this.departments = this.departments.concat(response.result);
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
    this.departments = [];
    this.loadData();
  }

  onBackToMain() {
    this.changeViewMode.emit(ViewModes.MainView);
    this.resetData();
  }
  onEdit(dept: Department) {
    this.changeViewMode.emit(ViewModes.EditView);
    this.deptProfile = Object.assign({}, dept);
  }
  onNewItem(dept: Department) {
    this.departments.push(dept);
  }

  onUpdate(dept: Department) {
    let index = this.departments.findIndex((d) => d.id === dept.id);
    if (index > -1) {
      this.departments.splice(index, 1, dept);
    }
  }

  onDelete(dept: Department) {
    let modalInstance = this.messageBox.showWarning(
      `Are you sure you want to delete ${dept.name}?`,
      "Confirm Delete"
    );
    modalInstance.result
      .then((response: MessageboxResponse) => {
        if (response === MessageboxResponse.OK) {
          let tid = this.notify.showProcessing("Deleting");
          this.deptService.delete(dept).subscribe(
            (response) => {
              if (response.success) {
                let index = this.departments.findIndex((d) => d.id === dept.id);
                if (index > -1) this.departments.splice(index, 1);
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

  updateData(dept: Department) {
    if (this.isProcessing) return;
    this.isProcessing = true;

    this.deptService.update(this.tempItem).subscribe(
      (response) => {
        if (response.success) {
          dept.name = response.result.name;
          this.notify.showSuccess(response.message, "success");
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
        dept.inEditMode = false;
        this.tempItem = null;
      }
    );
  }

  onNewDsgItem(dsg: Designation) {
    let dept = this.departments.find((d) => d.id === dsg.deptId);
    if (dept) {
      dept.Designations.push(dsg);
    }
  }

  resetData() {
    this.deptProfile = new Department(null, null);
    this.dsgProfile = new Designation(null, null);
  }

  switchToEditMode(item: Department | Designation) {
    if (!this.tempItem) {
      this.tempItem = Object.assign({}, item);
      item.inEditMode = true;
    }
  }

  cancelEditMode(item: Department | Designation) {
    item.inEditMode = false;
    this.tempItem = null;
  }

  updateDsg(dsg: Designation) {
    if (this.isProcessing) return;
    this.isProcessing = true;

    this.dsgService.update(this.tempItem).subscribe(
      (response) => {
        if (response.success) {
          this.notify.showSuccess(response.message, "success");
          dsg.name = response.result.name;
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
        dsg.inEditMode = false;
        this.tempItem = null;
      }
    );
  }

  onDeleteDsg(dsg: Designation) {
    let modalInstance = this.messageBox.showWarning(
      `Are you sure you want to delete ${dsg.name}?`,
      "Confirm Delete"
    );
    modalInstance.result
      .then((response: MessageboxResponse) => {
        if (response === MessageboxResponse.OK) {
          let tid = this.notify.showProcessing("Deleting");
          this.dsgService.delete(dsg).subscribe(
            (response) => {
              if (response.success) {
                let dept = this.departments.find((d) => d.id === dsg.deptId);
                if (dept) {
                  console.log(dept);
                  let index = dept.Designations.findIndex(
                    (d) => d.id === dsg.id
                  );
                  if (index > -1) {
                    dept.Designations.splice(index, 1);
                  }
                }
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
}
