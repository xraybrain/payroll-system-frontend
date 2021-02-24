import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  faCog,
  faEdit,
  faEllipsisH,
  faListAlt,
  faSearch,
  faSpinner,
  faTimes,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  MessageboxResponse,
  MiscellanousType,
  ViewModes,
} from "../models/app-enums";
import { Miscellanous } from "../models/miscellanous.models";
import { MessageboxService } from "../services/messagebox.service";
import { MiscellanousService } from "../services/miscellanous.service";
import { NotificationService } from "../services/notification.service";

@Component({
  selector: "app-miscellanous",
  templateUrl: "./miscellanous.component.html",
  styleUrls: ["./miscellanous.component.css"],
})
export class MiscellanousComponent implements OnInit {
  faSearch = faSearch;
  faEdit = faEdit;
  faTrash = faTrash;
  faSpinner = faSpinner;
  faTimes = faTimes;
  faCog = faCog;
  faEllipsisH = faEllipsisH;
  faListAlt = faListAlt;

  miscellanous: Miscellanous[] = [];

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

  miscProfile: Miscellanous = new Miscellanous();

  constructor(
    public miscService: MiscellanousService,
    public notify: NotificationService,
    public messageBox: MessageboxService
  ) {}

  ngOnInit() {
    this.loadData();
  }

  loadData(page = 1) {
    if (this.isLoading) return;
    this.isLoading = true;

    this.miscService.getAll(page, this.searchquery).subscribe(
      (response) => {
        if (response.result) {
          console.log(response);
          this.miscellanous = this.miscellanous.concat(response.result);
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
    this.miscellanous = [];
    this.loadData();
  }

  onBackToMain() {
    this.changeViewMode.emit(ViewModes.MainView);
    this.resetData();
  }
  onEdit(misc: Miscellanous) {
    this.changeViewMode.emit(ViewModes.EditView);
    this.miscProfile = Object.assign({}, misc);
  }

  onNewItem(misc: Miscellanous) {
    this.miscellanous.push(misc);
  }

  onUpdate(misc: Miscellanous) {
    let index = this.miscellanous.findIndex((d) => d.id === misc.id);
    if (index > -1) {
      this.miscellanous.splice(index, 1, misc);
    }
  }

  onDelete(misc: Miscellanous) {
    let modalInstance = this.messageBox.showWarning(
      `Are you sure you want to delete ${misc.title}?`,
      "Confirm Delete"
    );
    modalInstance.result
      .then((response: MessageboxResponse) => {
        if (response === MessageboxResponse.OK) {
          let tid = this.notify.showProcessing("Deleting");
          this.miscService.delete(misc).subscribe(
            (response) => {
              if (response.success) {
                let index = this.miscellanous.findIndex(
                  (d) => d.id === misc.id
                );
                if (index > -1) this.miscellanous.splice(index, 1);
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

  getMiscCategory(type: number) {
    return MiscellanousType[type];
  }

  resetData() {
    this.miscProfile = new Miscellanous(null, null, null, null, null, null);
  }
}
