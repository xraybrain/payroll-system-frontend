import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Feedback } from "../models/feedback";
import { Login } from "../models/login.models";
import { CoreService } from "./core.service";

@Injectable({
  providedIn: "root",
})
export class LoginService {
  private apiUrl = "api/logins/";
  constructor(private coreService: CoreService) {}

  getLogin(email: string): Observable<Feedback<Login>> {
    return this.coreService.getData(`api/login/${email}?`);
  }

  saveLogin(formData: Login): Observable<Feedback<Login>> {
    return this.coreService.postData(formData, this.apiUrl);
  }

  updateLogin(formData: Login): Observable<Feedback<Login>> {
    return this.coreService.putData(formData, this.apiUrl);
  }
}
