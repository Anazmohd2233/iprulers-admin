import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class VideosService {

  baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  createVideos(formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/vimeo/createVimeo`;
    return this.http.post<any>(apiUrl, formdata);
  }

  updateVideos(id:any,formdata: any) {
    const apiUrl = `${this.baseUrl}/admin/vimeo/update/${id}`;
    return this.http.post<any>(apiUrl, formdata);
  }

  getVideos(page: any,search?:string): Observable<any> {
    let params: any = {};

    if (search) {
      params.search = search;
    }
    const url = `${this.baseUrl}/admin/vimeo/list/${page}`;
    return this.http.get<any>(url, { params: params });
  }

  deleteVideo(id: any) {
    const apiUrl = `${this.baseUrl}/admin/vimeo/delete/${id}`;
    return this.http.delete<any>(apiUrl);
  }
}
