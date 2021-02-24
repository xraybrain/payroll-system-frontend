import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import {
  faCheck,
  faEnvelope,
  faHome,
  faLock,
  faSignInAlt,
  faUserPlus,
  faUserTag,
  faChevronCircleDown,
} from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "../services/auth.service";
@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  loginModel = { email: "", password: "", userType: "Admin" };
  faUserTag = faUserTag;
  faEnvelope = faEnvelope;
  faLock = faLock;
  faSignInAlt = faSignInAlt;
  faHome = faHome;
  faUserPlus = faUserPlus;
  faChevronDown = faChevronCircleDown;
  isProcessing = false;

  constructor(public authService: AuthService, public router: Router) {}

  ngOnInit() {
    if (this.authService.hasActiveLogin()) {
      this.router.navigate(["/admin/dashboard"]);
    }
  }

  onLogin() {
    let redirectUrl = "/admin/dashboard";
    if (this.isProcessing) return;
    this.isProcessing = true;
    this.authService.login(redirectUrl, this.loginModel, () => {
      this.isProcessing = false;
    });
  }
}
