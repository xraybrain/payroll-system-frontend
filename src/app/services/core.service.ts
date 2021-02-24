import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { baseUrl } from "../models/app-enums";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class CoreService {
  private host: string = baseUrl.host;
  constructor(private http: HttpClient, private authService: AuthService) {}

  getData<T>(apiURL: string): Observable<T> {
    return this.http.get<T>(
      `${
        this.host
      }${apiURL}&authorization=Bearer ${this.authService.getStatusOnRefresh()}`
    );
  }

  postData<T>(data: any, apiURL: string, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(
      `${this.host}${apiURL}`,
      {
        formData: data,
        authorization: `Bearer ${this.authService.getStatusOnRefresh()}`,
      },
      { headers }
    );
  }

  postUploadData<T>(
    data: any,
    apiURL: string,
    headers?: HttpHeaders
  ): Observable<T> {
    return this.http.post<T>(
      `${this.host}${apiURL}`,
      data,
      { headers }
    );
  }

  putData<T>(data, apiURL: string): Observable<T> {
    return this.http.put<T>(`${this.host}${apiURL}`, {
      formData: data,
      authorization: `Bearer ${this.authService.getStatusOnRefresh()}`,
    });
  }

  deleteData<T>(id: number, apiURL: string): Observable<T> {
    const httpOptions = {
      headers: new HttpHeaders({ "Content-Type": "application/json" }),
      body: {
        id,
        authorization: `Bearer ${this.authService.getStatusOnRefresh()}`,
      },
    };
    return this.http.delete<T>(`${this.host}${apiURL}`, httpOptions);
  }
}
