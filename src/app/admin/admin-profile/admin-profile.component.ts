import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { faSpinner, faUser, faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { ViewModes } from "src/app/models/app-enums";
import { Staff } from "src/app/models/staff.models";
import { AuthService } from "src/app/services/auth.service";
import { NotificationService } from "src/app/services/notification.service";

@Component({
  selector: "app-admin-profile",
  templateUrl: "./admin-profile.component.html",
  styleUrls: ["./admin-profile.component.css"],
})
export class AdminProfileComponent implements OnInit {
  faUser = faUserAlt;
  faSpinner = faSpinner;

  isEditMode: boolean;
  isMainMode: boolean;
  isNewItemMode: boolean;

  staffProfile: Staff = new Staff();

  isLoading = false;
  title = "Create Account Profile";

  constructor(
    public authService: AuthService,
    public notify: NotificationService
  ) {
    this.setViewMode(ViewModes.NewItemView);
  }

  onNewItem(staff: Staff) {}

  onUpdate(staff: Staff) {}

  setViewMode(mode: ViewModes) {
    this.isEditMode = mode === ViewModes.EditView;
    this.isMainMode = mode === ViewModes.MainView;
    this.isNewItemMode = mode === ViewModes.NewItemView;
  }

  onBackToMain() {
    this.setViewMode(ViewModes.MainView);
  }

  ngOnInit() {
    this.isLoading = true;
    this.authService.getCurrentUser().subscribe(
      (response) => {
        if (response.success) {
          if (response.result) {
            this.staffProfile = response.result;
            this.setViewMode(ViewModes.EditView);
            this.title = "";
          } else {
            let { login } = this.authService.decodeToken();
            this.staffProfile.loginId = login;
          }
        } else {
          this.notify.showWarning(response.message, "Operation failed");
        }
      },
      (reason) => {
        this.notify.showError(
          "We encountered a problem while contacting server.",
          "Operation failed"
        );
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}
