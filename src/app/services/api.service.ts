import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = '';

  constructor(private http:HttpClient) { }

  postFormData(formData: any): Observable<any> {
    const url = `${this.baseUrl}/your-api-endpoint`;
    return this.http.post(url, formData);
  }

  //fetching the data from API in [down menu]
  fetchData(): Observable<any> {
    return this.http.get<any>('your-api-url');
  }
}
