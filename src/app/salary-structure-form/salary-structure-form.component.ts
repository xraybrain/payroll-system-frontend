import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  faFolderOpen,
  faSpinner,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { ImageSnippet } from "../models/ImageSnippet.model";
import { SalaryStructure } from "../models/salary-structure.models";
import { NotificationService } from "../services/notification.service";
import { SalaryStructureService } from "../services/salary-structure.service";
import * as XLSX from "xlsx";
import { SalaryStructureList } from "../models/salary-structure-list";

@Component({
  selector: "app-salary-structure-form",
  templateUrl: "./salary-structure-form.component.html",
  styleUrls: ["./salary-structure-form.component.css"],
})
export class SalaryStructureFormComponent implements OnInit {
  faSpinner = faSpinner;
  faFolder = faFolderOpen;
  faTimes = faTimes;

  @Input()
  isNewItemMode: boolean;
  @Input()
  isEditMode: boolean;
  @Input()
  structureProfile: SalaryStructure;

  @Output()
  newItem: EventEmitter<SalaryStructure> = new EventEmitter();

  @Output()
  itemUpdate: EventEmitter<SalaryStructure> = new EventEmitter();

  // profileChange: BehaviorSubject<Staff> = new BehaviorSubject(new Staff());

  formErrors: any;

  isProcessing = false;

  selectedFile: ImageSnippet;
  form = new FormData();
  file: File;
  arrayBuffer: any;
  filelist: any;

  structures: [] = [];

  constructor(
    public structureService: SalaryStructureService,
    public notify: NotificationService
  ) {
    this.resetFormError();
  }

  saveData() {
    if (this.isProcessing) return;
    this.isProcessing = true;

    this.form.append("formData", JSON.stringify(this.structureProfile));
    this.structureService.save(this.form).subscribe(
      (response) => {
        if (response.success) {
          this.structures = [];
          this.newItem.emit(response.result);
          this.notify.showSuccess(response.message, "Success");
          this.resetProfile();
          this.resetFormError();
        } else {
          this.notify.showWarning(response.message, "Operation failed");
          console.log(response);
          this.formErrors = response.result || this.resetFormError();
        }
      },
      (reason) => {
        console.log(reason);
        this.notify.showError(
          "We encountered error while contacting server.",
          "Operation failed"
        );
      },
      () => {
        this.isProcessing = false;
      }
    );
  }

  ngOnInit() {}

  resetFormError() {
    this.formErrors = {
      name: null,
      shortName: null,
    };
  }

  resetProfile() {
    this.structureProfile = new SalaryStructure(null, null);
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
      this.structures = XLSX.utils.sheet_to_json(worksheet, { raw: true }) as [

      ];
      var arraylist = XLSX.utils.sheet_to_json(worksheet, { raw: true });
      this.filelist = [];
      this.form.append("fileToUpload", this.file);
    };
  }

  normalize(list) {
    delete list.Level;
    return Object.values(list);
  }
}
