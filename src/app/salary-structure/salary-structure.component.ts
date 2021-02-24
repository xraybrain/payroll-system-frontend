import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import {
  faChevronCircleRight,
  faCog,
  faEdit,
  faEllipsisH,
  faSearch,
  faSpinner,
  faTimes,
  faTimesCircle,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { MessageboxResponse, ViewModes } from "../models/app-enums";
import { SalaryStructure } from "../models/salary-structure.models";
import { MessageboxService } from "../services/messagebox.service";
import { NotificationService } from "../services/notification.service";
import { SalaryStructureService } from "../services/salary-structure.service";
import { SalaryStructureList } from "../models/salary-structure-list";

@Component({
  selector: "app-salary-structure",
  templateUrl: "./salary-structure.component.html",
  styleUrls: ["./salary-structure.component.css"],
})
export class SalaryStructureComponent implements OnInit {
  faSearch = faSearch;
  faEdit = faEdit;
  faTrash = faTrash;
  faSpinner = faSpinner;
  faTimes = faTimes;
  faCog = faCog;
  faEllipsisH = faEllipsisH;
  faTimesCirlce = faTimesCircle;
  faChevronCircleRight = faChevronCircleRight;

  structures: SalaryStructure[] = [];
  tempStructure: SalaryStructure = null;

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

  structureProfile: SalaryStructure = new SalaryStructure(null, null);
  isProcessing = false;

  constructor(
    public structureService: SalaryStructureService,
    public notify: NotificationService,
    public messageBox: MessageboxService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(page = 1) {
    if (this.isLoading) return;
    this.isLoading = true;

    this.structureService.getAll(page, this.searchquery).subscribe(
      (response) => {
        if (response.result) {
          this.structures = this.structures.concat(response.result);
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
    this.structures = [];
    this.loadData();
  }

  onBackToMain() {
    this.changeViewMode.emit(ViewModes.MainView);
    this.resetData();
  }
  onEdit(structure: SalaryStructure) {
    this.changeViewMode.emit(ViewModes.EditView);
    this.structureProfile = Object.assign({}, structure);
  }

  onNewItem(structure: SalaryStructure) {
    this.structures.push(structure);
  }

  onUpdate(structure: SalaryStructure) {
    let index = this.structures.findIndex((d) => d.id === structure.id);
    if (index > -1) {
      this.structures.splice(index, 1, structure);
    }
  }

  onDelete(structure: SalaryStructure) {
    let modalInstance = this.messageBox.showWarning(
      `Are you sure you want to delete ${structure.name}?`,
      "Delete Warning"
    );
    modalInstance.result
      .then((response: MessageboxResponse) => {
        if (response === MessageboxResponse.OK) {
          let tid = this.notify.showProcessing("Deleting user");
          this.structureService.delete(structure).subscribe(
            (response) => {
              if (response.success) {
                let index = this.structures.findIndex(
                  (d) => d.id === structure.id
                );
                if (index > -1) this.structures.splice(index, 1);
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

  normalizeList(list: SalaryStructureList[]) {
    let level: number;
    let normalized: SalaryStructureList[][] = [];
    let group: SalaryStructureList[] = [];

    for (let item of list) {
      if (item.level === level) {
        group.push(item);
      } else {
        if (group.length > 0) normalized.push(group);
        group = [];
        level = item.level;
        group.push(item);
      }
    }
    if (group.length > 0) normalized.push(group);
    return normalized;
  }

  resetData() {
    this.structureProfile = new SalaryStructure(null, null);
  }

  switchToEditMode(structure: SalaryStructure) {
    if (!this.tempStructure) {
      this.tempStructure = Object.assign({}, structure);
      structure.inEditMode = true;
    }
  }

  cancelEditMode(structure: SalaryStructure) {
    structure.inEditMode = false;
    this.tempStructure = null;
  }

  updateData(structure: SalaryStructure) {
    if (this.isProcessing) return;
    this.isProcessing = true;
    let tid = this.notify.showProcessing("Updating");
    this.structureService.update(this.tempStructure).subscribe(
      (response) => {
        if (response.success) {
          this.notify.showSuccess(response.message, "success");
          structure.name = response.result.name;
          structure.shortName = response.result.shortName;
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
        this.tempStructure = null;
        structure.inEditMode = false;
        this.notify.hideProcessing(tid);
      }
    );
  }
}
