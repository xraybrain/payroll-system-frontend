import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Department } from '../models/department.models';
import { Feedback } from '../models/feedback';
import { CoreService } from './core.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {
  private apiUrl = "api/departments";
  constructor(private coreService: CoreService) {}

  getAll(
    page = 1,
    searchquery = "",
    paginate = true
  ): Observable<Feedback<Department[]>> {
    return this.coreService.getData(
      `${this.apiUrl}?page=${page}&searchquery=${searchquery}&paginate=${paginate}`
    );
  }

  save(formData: Department): Observable<Feedback<Department>> {
    return this.coreService.postData(formData, this.apiUrl);
  }

  update(formData: Department): Observable<Feedback<Department>> {
    return this.coreService.putData(formData, this.apiUrl);
  }

  delete(formData: Department): Observable<Feedback<Department>> {
    return this.coreService.deleteData(formData.id, this.apiUrl);
  }
}
