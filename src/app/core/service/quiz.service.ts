import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminListResponse, QuizResponse } from 'src/app/apps/crm/quiz/model';
import { QuestionResponse, QuizModalData } from 'src/app/apps/crm/quiz_answers/answers/model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

   baseUrl = environment.baseUrl;
    authorization: any;
  
    constructor(private http: HttpClient) {}

    createQuiz(formdata: any) {
        const apiUrl = `${this.baseUrl}/admin/quiz/create`;
        // console.log('apiurl for listing users', apiUrl)
        this.authorization = localStorage.getItem("Authorization");
    
        const headers = new HttpHeaders({
          Authorization: this.authorization,
        });

        return this.http.post<QuizResponse>(apiUrl, formdata, { headers });

      }

      getQuiz(courseId:any): Observable<AdminListResponse> {
        const url = `${this.baseUrl}/admin/quiz/list/1?course_id=${courseId}`;
        this.authorization = localStorage.getItem("Authorization");
    
        const headers = new HttpHeaders({ Authorization: this.authorization });
    
        return this.http.get<AdminListResponse>(url, { headers });
      }

      createQuestion(data: any) {
        const apiUrl = `${this.baseUrl}/admin/quiz/add_question`;
        // console.log('apiurl for listing users', apiUrl)
        this.authorization = localStorage.getItem("Authorization");
    
        const headers = new HttpHeaders({
          Authorization: this.authorization,
        });

        return this.http.post<QuizModalData>(apiUrl, data, { headers });

      }

      getQuestion(quiz_id:any): Observable<QuestionResponse> {
        const url = `${this.baseUrl}/admin/quiz/list_question/1?quizId=${quiz_id}`;
        this.authorization = localStorage.getItem("Authorization");
    
        const headers = new HttpHeaders({ Authorization: this.authorization });
    
        return this.http.get<QuestionResponse>(url, { headers });
      }
}
