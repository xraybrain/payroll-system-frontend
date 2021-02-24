import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Feedback } from "../models/feedback";
import { Miscellanous } from "../models/miscellanous.models";
import { CoreService } from "./core.service";

@Injectable({
  providedIn: "root",
})
export class MiscellanousService {
  private apiUrl = "api/miscellanous";
  constructor(private coreService: CoreService) {}

  getAll(
    page = 1,
    searchquery = "",
    paginate = true
  ): Observable<Feedback<Miscellanous[]>> {
    return this.coreService.getData(
      `${this.apiUrl}?page=${page}&searchquery=${searchquery}&paginate=${paginate}`
    );
  }

  save(formData: Miscellanous): Observable<Feedback<Miscellanous>> {
    return this.coreService.postData(formData, this.apiUrl);
  }

  update(formData: Miscellanous): Observable<Feedback<Miscellanous>> {
    return this.coreService.putData(formData, this.apiUrl);
  }

  delete(formData: Miscellanous): Observable<Feedback<Miscellanous>> {
    return this.coreService.deleteData(formData.id, this.apiUrl);
  }
}
