import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { NotificationService } from "./services/notification.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private notify: NotificationService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (localStorage) {
      if (localStorage.getItem("access_token")) {
        return true;
      } else {
        this.notify.showWarning(
          "You must login before you can view this page",
          "Warning"
        );
        this.router.navigate(["/login"]);
        return false;
      }
    } else {
      return false;
    }
  }
}
