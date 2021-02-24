import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Feedback } from "../models/feedback";
import { CoreService } from "./core.service";
import { NotificationService } from "./notification.service";
import { JwtHelperService } from "@auth0/angular-jwt";
import { BehaviorSubject } from "rxjs";
import { Staff } from "../models/staff.models";
import { baseUrl } from "../models/app-enums";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public userStatus: string;
  public userStatusChanges: BehaviorSubject<string> = new BehaviorSubject<string>(
    ""
  );
  private authApiUrl = baseUrl.host + "api/auth/login/";

  constructor(
    private http: HttpClient,
    private router: Router,
    private notify: NotificationService,
    private jwtService: JwtHelperService
  ) {}

  setUserStatus(userStatus: any): void {
    this.userStatus = userStatus;
    this.userStatusChanges.next(userStatus);
  }

  login(
    redirectUrl: string,
    formData: { email: string; password: string },
    onComplete: () => void
  ) {
    const headers = new HttpHeaders().set("Content-Type", "application/json");
    // send a post request
    this.http
      .post<Feedback<{ token: string; redirectURL: string }>>(
        this.authApiUrl,
        formData,
        { headers }
      )
      .subscribe(
        (response) => {
          if (response.success) {
            localStorage.setItem("access_token", response.result.token);
            this.setUserStatus(response.result.token);
            this.router.navigate([response.result.redirectURL]);
          } else {
            this.notify.showWarning(response.message, "Login Failed");
          }
        },
        (reason) => {
          this.notify.showError(
            "We encountered a problem while contacting server",
            "Operation failed"
          );
          onComplete();
        },
        () => {
          onComplete();
        }
      );
  }

  logout() {
    // just remove the access token and redirect
    localStorage.removeItem("access_token");
    this.setUserStatus(null);
    this.router.navigate(["/login"]);
  }

  public decodeToken() {
    let token: string = localStorage.getItem("access_token");
    let decoded = null;
    if (token) {
      decoded = this.jwtService.decodeToken(token);
    }
    return decoded;
  }

  public getUserType(): string {
    let decoded = this.decodeToken();
    if (decoded) {
      return decoded["userType"];
    }
    return null;
  }

  public getStatusOnRefresh() {
    let token: string = localStorage.getItem("access_token");
    let decoded = this.decodeToken();
    if (token) {
      if (decoded) {
        if (Math.floor(Date.now() / 1000) > decoded["exp"]) this.logout();
      } else {
        this.logout();
      }
      this.setUserStatus(token);
    }
    return token;
  }

  public getCurrentUser() {
    return this.http.get<Feedback<Staff>>(
      baseUrl.host +
        `api/auth/user?authorization=Bearer ${localStorage.getItem(
          "access_token"
        )}`
    );
  }

  public hasActiveLogin() {
    let activeLogin = true;
    let token: string = localStorage.getItem("access_token");
    let decoded = this.jwtService.decodeToken(token);
    if (decoded) {
      if (Math.floor(Date.now() / 1000) > decoded["exp"]) activeLogin = false;
    } else {
      activeLogin = false;
    }
    return activeLogin;
  }

  public getAuthToken() {
    return `authorization=Bearer ${localStorage.getItem("access_token")}`;
  }
}
