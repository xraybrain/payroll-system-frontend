import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import {
  faCalendar,
  faCalendarAlt,
  faFolderOpen,
  faSpinner,
  faTimes,
  faCloudUploadAlt,
} from "@fortawesome/free-solid-svg-icons";
import { BehaviorSubject } from "rxjs";
import { Bank } from "../models/bank.models";
import { Department } from "../models/department.models";
import { Designation } from "../models/designation.models";
import { Grade } from "../models/grade.models";
import { Level } from "../models/level.models";
import { SalaryStructure } from "../models/salary-structure.models";
import { StaffClass } from "../models/staff-class.models";
import { Staff } from "../models/staff.models";
import { AppService } from "../services/app.service";
import { BankService } from "../services/bank.service";
import { DepartmentService } from "../services/department.service";
import { NotificationService } from "../services/notification.service";
import { SalaryStructureService } from "../services/salary-structure.service";
import { StaffService } from "../services/staff.service";
import { ImageSnippet } from "../models/ImageSnippet.model";
import { DesignationService } from "../services/designation.service";

@Component({
  selector: "app-staff-form",
  templateUrl: "./staff-form.component.html",
  styleUrls: ["./staff-form.component.css"],
})
export class StaffFormComponent implements OnInit {
  faSpinner = faSpinner;
  faCalendar = faCalendarAlt;
  faFolder = faFolderOpen;
  faTimes = faTimes;
  faCloudUploadAlt = faCloudUploadAlt;

  @Input()
  isNewItemMode: boolean;
  @Input()
  isEditMode: boolean;
  @Input()
  staffProfile: Staff;
  @Input()
  title: string;

  @Output()
  newItem: EventEmitter<Staff> = new EventEmitter();

  @Output()
  itemUpdate: EventEmitter<Staff> = new EventEmitter();

  profileChange: BehaviorSubject<Staff> = new BehaviorSubject(new Staff());

  formErrors: any;

  isProcessing = false;

  levels: Level[] = [];
  grades: Grade[] = [];
  staffClasses: StaffClass[] = [];
  departments: Department[] = [];

  dateOfEmp: {
    day: number;
    month: number;
    year: number;
  };

  dateOfRet: {
    day: number;
    month: number;
    year: number;
  };

  designations: Designation[] = [];
  salaryStructures: SalaryStructure[] = [];
  banks: Bank[] = [];
  selectedImage: ImageSnippet;
  form = new FormData();

  constructor(
    public staffService: StaffService,
    public appService: AppService,
    public deptService: DepartmentService,
    public dsgService: DesignationService,
    public salaryStrService: SalaryStructureService,
    public bankService: BankService,
    public notify: NotificationService
  ) {
    this.resetFormError();
  }

  getDateOfEmp(): string {
    return `${this.dateOfEmp.year}-${this.dateOfEmp.month}-${this.dateOfEmp.day}`;
  }

  getDateOfRet(): string {
    return `${this.dateOfRet.year}-${this.dateOfRet.month}-${this.dateOfRet.day}`;
  }

  saveData() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    if (this.dateOfEmp) {
      this.staffProfile.dateOfEmp = this.getDateOfEmp();
    }
    if (this.dateOfRet) {
      this.staffProfile.dateOfRet = this.getDateOfRet();
    }

    this.form.append("formData", JSON.stringify(this.staffProfile));
    this.staffService.save(this.form).subscribe(
      (response) => {
        this.isProcessing = false;
        if (response.success) {
          this.newItem.emit(response.result);
          this.notify.showSuccess(response.message, "Success");
          this.resetProfile();
          this.resetFormError();
        } else {
          this.notify.showWarning(response.message, "Operation failed");
          console.log(response);
          response.result
            ? (this.formErrors = response.result)
            : this.resetFormError();
        }
      },
      (reason) => {
        console.log(reason);
        this.notify.showError(
          "We encountered error while contacting server.",
          "Operation failed"
        );
      }
    );
  }

  updateData() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    if (this.dateOfEmp) {
      this.staffProfile.dateOfEmp = this.getDateOfEmp();
    }
    if (this.dateOfRet) {
      this.staffProfile.dateOfRet = this.getDateOfRet();
    }
    this.staffService.update(this.staffProfile).subscribe(
      (response) => {
        this.formErrors = response.result || {};
        if (response.success) {
          this.notify.showSuccess(response.message, "success");
          this.itemUpdate.emit(response.result);
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
      }
    );
  }

  changePassport() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    let tid = this.notify.showProcessing("Updating");

    this.form.append("formData", JSON.stringify({ id: this.staffProfile.id }));
    this.staffService.updatePassport(this.form).subscribe(
      (response) => {
        this.notify.hideProcessing(tid);
        this.formErrors = response.result || {};
        if (response.success) {
          this.notify.showSuccess(response.message, "success");
          this.itemUpdate.emit(response.result);
        } else {
          this.notify.showError(response.message, "Operation failed");
        }
      },
      (reason) => {
        this.isProcessing = false;
        this.notify.hideProcessing(tid)
        console.log(reason);
        this.notify.showError("Unable to contact server.", "Operation failed");
      },
      () => {
        this.isProcessing = false;
      }
    );
  }

  ngOnInit() {
    this.appService.getLevels().subscribe(
      (response) => {
        if (response.success) {
          this.levels = response.result;
        } else {
          this.notify.showWarning(response.message, "Operation failed");
        }
      },
      (reason) => {
        console.log(reason);
        this.notify.showError(
          "We encountered a problem while contacting server",
          "Operation failed"
        );
      }
    );

    this.appService.getGrades().subscribe(
      (response) => {
        if (response.success) {
          this.grades = response.result;
        } else {
          this.notify.showWarning(response.message, "Operation failed");
        }
      },
      (reason) => {
        console.log(reason);
        this.notify.showError(
          "We encountered a problem while contacting server",
          "Operation failed"
        );
      }
    );

    this.appService.getStaffClasses().subscribe(
      (response) => {
        if (response.success) {
          this.staffClasses = response.result;
        } else {
          this.notify.showWarning(response.message, "Operation failed");
        }
      },
      (reason) => {
        console.log(reason);
        this.notify.showError(
          "We encountered a problem while contacting server",
          "Operation failed"
        );
      }
    );

    this.deptService.getAll(1, "", false).subscribe(
      (response) => {
        if (response.success) {
          this.departments = response.result;
        } else {
          this.notify.showWarning(response.message, "Operation failed");
        }
      },
      (reason) => {
        console.log(reason);
        this.notify.showError(
          "We encountered a problem while contacting server",
          "Operation failed"
        );
      }
    );

    this.dsgService.getAll(1, "", false).subscribe(
      (response) => {
        if (response.success) {
          this.designations = response.result;
        } else {
          this.notify.showWarning(response.message, "Operation failed");
        }
      },
      (reason) => {
        console.log(reason);
        this.notify.showError(
          "We encountered a problem while contacting server",
          "Operation failed"
        );
      }
    );

    this.salaryStrService.getAll(1, "", false).subscribe(
      (response) => {
        if (response.success) {
          this.salaryStructures = response.result;
        } else {
          this.notify.showWarning(response.message, "Operation failed");
        }
      },
      (reason) => {
        console.log(reason);
      }
    );

    this.bankService.getAll(1, "", false).subscribe(
      (response) => {
        if (response.success) {
          this.banks = response.result;
        } else {
          this.notify.showWarning(response.message, "Operation failed");
        }
      },
      (reason) => {
        console.log(reason);
      }
    );

    this.profileChange.subscribe((profile: Staff) => {
      if (profile && profile.dateOfEmp) {
        this.setDateOfEmp(profile.dateOfEmp);
      }
      if (profile && profile.dateOfEmp) {
        this.setDateOfRet(profile.dateOfRet);
      }
    });
  }

  setDateOfEmp(value: string) {
    let d = new Date(value);
    this.dateOfEmp = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
    };
  }

  setDateOfRet(value: string) {
    let d = new Date(value);
    this.dateOfRet = {
      year: d.getFullYear(),
      month: d.getMonth() + 1,
      day: d.getDate(),
    };
  }

  ngOnChanges(): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.profileChange.next(this.staffProfile);
  }

  resetFormError() {
    this.formErrors = {
      surname: null,
      firstname: null,
      othername: null,
      gender: null,
      dateOfEmp: null,
      dateOfRet: null,
      accountNo: null,
      loginId: null,
      deptId: null,
      dsgId: null,
      classId: null,
      salaryStrId: null,
      bankId: null,
      level: null,
      grade: null,
    };
  }

  resetProfile() {
    this.staffProfile = new Staff();
    this.dateOfEmp = null;
    this.dateOfRet = null;
    this.selectedImage = null;
  }

  onFileChanged(imageInput) {
    let file: File = imageInput.files[0];
    let reader: FileReader = new FileReader();

    reader.addEventListener("load", (event) => {
      this.selectedImage = new ImageSnippet(event.target["result"], file);
      if (!this.selectedImage.hasSizeError) {
        this.form.append("fileToUpload", file);
        this.staffProfile.fileToUpload = file;
      } else {
        this.form.append("fileToUpload", "");
        this.staffProfile.fileToUpload = null;
      }
    });
    if (file instanceof Blob) {
      reader.readAsDataURL(file);
    }
  }
}
