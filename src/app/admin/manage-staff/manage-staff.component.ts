import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  faList,
  faPlusCircle,
  faThList,
  faTimes,
  faUser,
  faUsers,
  faCloudUploadAlt,
  faFileUpload,
  faCheckCircle,
  faSpinner,
  faTimesCircle,
  faDownload,
  faCloudDownloadAlt,
} from "@fortawesome/free-solid-svg-icons";
import { ViewModes } from "src/app/models/app-enums";
import { Staff } from "src/app/models/staff.models";
import { MessageboxService } from "src/app/services/messagebox.service";
import { NotificationService } from "src/app/services/notification.service";
import { StaffService } from "src/app/services/staff.service";
import * as XLSX from "xlsx";

@Component({
  selector: "app-manage-staff",
  templateUrl: "./manage-staff.component.html",
  styleUrls: ["./manage-staff.component.css"],
})
export class ManageStaffComponent implements OnInit {
  faList = faList;
  faPlusCircle = faPlusCircle;
  faTimes = faTimes;
  faThList = faThList;
  faUser = faUser;
  faUsers = faUsers;
  faCloudUploadAlt = faCloudUploadAlt;
  faCheckCircle = faCheckCircle;
  faSpinner = faSpinner;
  faTimesCircle = faTimesCircle;
  faDownload = faCloudDownloadAlt;

  isEditMode: boolean;
  isMainMode: boolean;
  isNewItemMode: boolean;
  isFileUploadPreview: boolean;

  form = new FormData();
  file: File;
  arrayBuffer: any;
  filelist: any;
  staffs: Staff[] = [];
  refreshStaffs = false;

  constructor(
    public route: ActivatedRoute,
    public staffService: StaffService,
    public notify: NotificationService,
    public msgBox: MessageboxService
  ) {
    let mode = route.snapshot.params["mode"];
    if (mode === "new") {
      this.setViewMode(ViewModes.NewItemView);
    } else {
      this.setViewMode(ViewModes.MainView);
    }
  }

  setViewMode(mode: ViewModes) {
    this.isEditMode = mode === ViewModes.EditView;
    this.isMainMode = mode === ViewModes.MainView;
    this.isNewItemMode = mode === ViewModes.NewItemView;
    this.isFileUploadPreview = mode === ViewModes.FileUploadPreview;
  }

  onBackToMain() {
    this.setViewMode(ViewModes.MainView);
  }

  onFileChanged(event) {
    this.file = event.files[0];
    let fileReader = new FileReader();
    if (this.file) fileReader.readAsArrayBuffer(this.file);
    fileReader.onload = (e) => {
      this.arrayBuffer = fileReader.result;
      var data = new Uint8Array(this.arrayBuffer);
      var arr = new Array();
      for (var i = 0; i != data.length; ++i)
        arr[i] = String.fromCharCode(data[i]);
      var bstr = arr.join("");
      var workbook = XLSX.read(bstr, { type: "binary" });
      var first_sheet_name = workbook.SheetNames[0];
      var worksheet = workbook.Sheets[first_sheet_name];
      this.staffs = XLSX.utils.sheet_to_json(worksheet, { raw: true }) as [];
      var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.filelist = [];
      this.form.append("fileToUpload", this.file);
      this.setViewMode(ViewModes.FileUploadPreview);
    };
  }
  isProcessing = false;
  onSaveUpload() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.staffService.saveUpload(this.form).subscribe(
      (response) => {
        this.setViewMode(ViewModes.MainView);
        this.refreshStaffs = true;
        if (response.success) {
          this.notify.showSuccess(response.message, "Success");
        } else {
          this.notify.showWarning(response.message, "Operation failed");
          if (Array.isArray(response.result))
            this.msgBox.showInfo(response.result.join(", "), "Failed to save");
        }
      },
      (reason) => {
        this.isProcessing = false;
        console.log(reason);
      },
      () => {
        this.isProcessing = false;
      }
    );
  }

  onRefreshed(status: boolean) {
    this.refreshStaffs = false;
  }

  ngOnInit() {}
}
