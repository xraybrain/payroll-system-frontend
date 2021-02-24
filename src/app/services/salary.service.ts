import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Feedback } from "../models/feedback";
import { Salary } from "../models/salary.models";
import { CoreService } from "./core.service";

@Injectable({
  providedIn: "root",
})
export class SalaryService {
  private apiUrl = "api/payrolls/salaries/";
  constructor(private coreService: CoreService) {}

  getAll(
    pid: number,
    page = 1,
    searchquery = "",
    paginate = true,
    filter = null
  ): Observable<Feedback<Salary[]>> {
    return this.coreService.getData(
      `${this.apiUrl}?pid=${pid}&page=${page}&searchquery=${searchquery}&paginate=${paginate}`
    );
  }

  calculateSalary(formData: {
    payrollId: number;
  }): Observable<Feedback<Salary>> {
    return this.coreService.postData(formData, this.apiUrl);
  }

  update(formData: Salary): Observable<Feedback<Salary>> {
    return this.coreService.putData(formData, this.apiUrl);
  }

  delete(formData: Salary): Observable<Feedback<Salary>> {
    return this.coreService.deleteData(formData.id, this.apiUrl);
  }
}
