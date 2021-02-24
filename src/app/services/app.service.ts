import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Feedback } from "../models/feedback";
import { Grade } from "../models/grade.models";
import { Level } from "../models/level.models";
import { StaffClass } from "../models/staff-class.models";
import { CoreService } from "./core.service";

@Injectable({
  providedIn: "root",
})
export class AppService {
  private apiUrl = "api/";
  constructor(private coreService: CoreService) {}

  getLevels(): Observable<Feedback<Level[]>> {
    return this.coreService.getData(`${this.apiUrl}levels?`);
  }

  getGrades(): Observable<Feedback<Grade[]>> {
    return this.coreService.getData(`${this.apiUrl}grades?`);
  }

  getStaffClasses(): Observable<Feedback<StaffClass[]>> {
    return this.coreService.getData(`${this.apiUrl}staff/classes?`);
  }
}
