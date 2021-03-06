import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  faCog,
  faSpinner,
  faEye,
  faEyeSlash,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { AuthService } from "../services/auth.service";
import { NotificationService } from "../services/notification.service";

@Component({
  selector: "app-reset-password-modal",
  templateUrl: "./reset-password-modal.component.html",
  styleUrls: ["./reset-password-modal.component.css"],
})
export class ResetPasswordModalComponent implements OnInit {
  faSpinner = faSpinner;
  faCog = faCog;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faTimes = faTimes;

  passwordProfile = { password: null, confirmPassword: null };
  unMask = false;
  inputType = "password";
  pwdMatch = true;

  constructor(
    public authService: AuthService,
    public notify: NotificationService,
    public modalInstance: NgbActiveModal
  ) {}

  ngOnInit() {}

  togglePwdMask() {
    this.unMask = !this.unMask;
    if (this.unMask) this.inputType = "text";
    else this.inputType = "password";
  }

  close() {
    this.modalInstance.close("closed");
  }

  isMatch() {
    this.pwdMatch =
      this.passwordProfile.password === this.passwordProfile.confirmPassword;
  }
  isProcessing = false;
  resetPassword() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.authService.resetPassword(this.passwordProfile).subscribe(
      (response) => {
        if (response.success) {
          this.notify.showSuccess("Password changed successfully", "Success");
          this.modalInstance.close("closed");
          this.authService.logout();
        } else {
          this.notify.showWarning(response.message, "Operation failed");
        }
      },
      (reason) => {
        this.notify.showError("Failed to reset password", "Operation failed");
        this.isProcessing = false;
      },
      () => (this.isProcessing = false)
    );
  }
}
