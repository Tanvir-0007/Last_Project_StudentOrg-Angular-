import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from './student.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {
  private baseUrl = 'http://localhost:8080/api/students';

  constructor(private http: HttpClient) {}

  getStudents(page: number, size: number): Observable<any> {
    return this.http.get(`${this.baseUrl}?page=${page}&size=${size}`);
  }

  searchStudents(name: string | null, id: number | null, page: number, size: number): Observable<any> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (name) {
      params = params.set('name', name);
    }
    if (id) {
      params = params.set('id', id);
    }

    return this.http.get(`${this.baseUrl}/search`, { params });
  }
  getStudentById(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/students/${id}`);
  }
  getStudent(id: number): Observable<Student> {
    return this.http.get<Student>(`${this.baseUrl}/${id}`);
  }

  addStudent(student: Student): Observable<Student> {
    return this.http.post<Student>(this.baseUrl, student);
  }

  updateStudent(id: number, student: Student): Observable<Student> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.put<Student>(url, student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
