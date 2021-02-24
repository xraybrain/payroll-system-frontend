import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Feedback } from "../models/feedback";
import { SalaryStructure } from "../models/salary-structure.models";
import { CoreService } from "./core.service";

@Injectable({
  providedIn: "root",
})
export class SalaryStructureService {
  private apiUrl = "api/salary/structures";
  constructor(private coreService: CoreService) {}

  getAll(
    page = 1,
    searchquery = "",
    paginate = true
  ): Observable<Feedback<SalaryStructure[]>> {
    return this.coreService.getData(
      `${this.apiUrl}?page=${page}&searchquery=${searchquery}&paginate=${paginate}`
    );
  }

  save(formData: FormData): Observable<Feedback<SalaryStructure>> {
    return this.coreService.postUploadData(formData, this.apiUrl);
  }

  update(formData: SalaryStructure): Observable<Feedback<SalaryStructure>> {
    return this.coreService.putData(formData, this.apiUrl);
  }

  delete(formData: SalaryStructure): Observable<Feedback<SalaryStructure>> {
    return this.coreService.deleteData(formData.id, this.apiUrl);
  }
}
