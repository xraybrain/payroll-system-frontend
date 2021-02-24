import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Designation } from "../models/designation.models";
import { Feedback } from "../models/feedback";
import { CoreService } from "./core.service";

@Injectable({
  providedIn: "root",
})
export class DesignationService {
  private apiUrl = "api/departments/designations/";
  constructor(private coreService: CoreService) {}

  save(formData: Designation): Observable<Feedback<Designation>> {
    return this.coreService.postData(formData, this.apiUrl);
  }

  update(formData: Designation): Observable<Feedback<Designation>> {
    return this.coreService.putData(formData, this.apiUrl);
  }

  delete(formData: Designation): Observable<Feedback<Designation>> {
    return this.coreService.deleteData(formData.id, this.apiUrl);
  }
}
