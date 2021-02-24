import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Feedback } from "../models/feedback";
import { Payroll } from "../models/payroll.models";
import { CoreService } from "./core.service";

@Injectable({
  providedIn: "root",
})
export class PayrollService {
  private apiUrl = "api/payrolls";
  constructor(private coreService: CoreService) {}

  getAll(
    page = 1,
    searchquery = "",
    paginate = true
  ): Observable<Feedback<Payroll[]>> {
    return this.coreService.getData(
      `${this.apiUrl}?page=${page}&searchquery=${searchquery}&paginate=${paginate}`
    );
  }

  getPayroll(pid: number): Observable<Feedback<Payroll>> {
    return this.coreService.getData(`api/payroll/${pid}?`);
  }

  save(formData: Payroll): Observable<Feedback<Payroll>> {
    return this.coreService.postData(formData, this.apiUrl);
  }

  update(formData: Payroll): Observable<Feedback<Payroll>> {
    return this.coreService.putData(formData, this.apiUrl);
  }

  delete(formData: Payroll): Observable<Feedback<Payroll>> {
    return this.coreService.deleteData(formData.id, this.apiUrl);
  }
}
