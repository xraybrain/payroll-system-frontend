import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Feedback } from "../models/feedback";
import { Staff } from "../models/staff.models";
import { CoreService } from "./core.service";

@Injectable({
  providedIn: "root",
})
export class StaffService {
  private apiUrl = "api/staffs/";
  constructor(private coreService: CoreService) {}

  getAll(
    page = 1,
    searchquery = "",
    paginate = true
  ): Observable<Feedback<Staff[]>> {
    return this.coreService.getData(
      `${this.apiUrl}?page=${page}&searchquery=${searchquery}&paginate=${paginate}`
    );
  }

  save(formData: FormData): Observable<Feedback<Staff>> {
    return this.coreService.postUploadData(formData, this.apiUrl);
  }

  update(formData: Staff): Observable<Feedback<Staff>> {
    return this.coreService.putData(formData, this.apiUrl);
  }

  delete(formData: Staff): Observable<Feedback<Staff>> {
    return this.coreService.deleteData(formData.id, this.apiUrl);
  }

  getDashboardSummary(): Observable<Feedback<any>> {
    return this.coreService.getData(`${this.apiUrl}dashboard/?`);
  }
}
