import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  faArrowCircleLeft,
  faArrowCircleRight,
  faSignInAlt,
  faSpinner,
  faUndoAlt,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Login } from "../models/login.models";
import { LoginService } from "../services/login.service";
import { NotificationService } from "../services/notification.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.css"],
})
export class ForgotPasswordComponent implements OnInit {
  faArrowCircleRight = faArrowCircleRight;
  faSpinner = faSpinner;
  faArrowCircleLeft = faArrowCircleLeft;
  faSignInAlt = faSignInAlt;
  faUserPlus = faUserPlus;
  faUndo = faUndoAlt;

  resetPassword = {
    password: "",
    confirmPassword: "",
  };

  confirmEmail = { email: "" };
  isValidEmail = false;
  isProcessing = false;
  login: Login;

  constructor(
    public loginService: LoginService,
    public notify: NotificationService,
    public router: Router
  ) {}

  ngOnInit() {}

  onConfirmEmail() {
    if (this.isProcessing) return;

    this.isProcessing = true;
    this.loginService.getLogin(this.confirmEmail.email).subscribe(
      (response) => {
        this.isProcessing = false;
        if (response.success && response.result) {
          this.isValidEmail = true;
          this.login = response.result;
        } else {
          this.notify.showWarning(response.message, "Not Found");
        }
      },
      (reason) => {
        this.notify.showError(
          "We encountered a problem while contacting server",
          "Operation failed"
        );
      }
    );
  }

  onResetPassword() {
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.login.password = this.resetPassword.password;

    this.loginService.updateLogin(this.login).subscribe(
      (response) => {
        if (response.success) {
          this.router.navigate(["/login"]);
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
  }
}
