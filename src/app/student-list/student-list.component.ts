import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';
import { Student } from '../student.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-student-list',
  templateUrl: './student-list.component.html'
})
export class StudentListComponent implements OnInit {
  students: Student[] = [];
  page = 0;
  size = 10;
  totalPages: number[] = [];

  constructor(private studentService: StudentService, private router: Router) {}

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getStudents(this.page, this.size).subscribe(response => {
      this.students = response.content;
      this.totalPages = Array.from({ length: response.totalPages }, (_, i) => i + 1);
    });
  }

  onPageSizeChange(event: Event) {
    const newSize = (event.target as HTMLSelectElement).value;
    this.changePageSize(newSize);
  }

  changePageSize(newSize: string) {
    this.size = +newSize;  // Convert the string to a number
    this.page = 0;
    this.loadStudents();
  }

  changePage(newPage: number) {
    this.page = newPage;
    this.loadStudents();
  }



}
