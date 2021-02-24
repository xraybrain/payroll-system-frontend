import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Bank } from "../models/bank.models";
import { Feedback } from "../models/feedback";
import { CoreService } from "./core.service";

@Injectable({
  providedIn: "root",
})
export class BankService {
  private apiUrl = "api/banks";
  constructor(private coreService: CoreService) {}

  getAll(
    page = 1,
    searchquery = "",
    paginate = true
  ): Observable<Feedback<Bank[]>> {
    return this.coreService.getData(
      `${this.apiUrl}?page=${page}&searchquery=${searchquery}&paginate=${paginate}`
    );
  }

  save(formData: Bank): Observable<Feedback<Bank>> {
    return this.coreService.postData(formData, this.apiUrl);
  }

  update(formData: Bank): Observable<Feedback<Bank>> {
    return this.coreService.putData(formData, this.apiUrl);
  }

  delete(formData: Bank): Observable<Feedback<Bank>> {
    return this.coreService.deleteData(formData.id, this.apiUrl);
  }
}
