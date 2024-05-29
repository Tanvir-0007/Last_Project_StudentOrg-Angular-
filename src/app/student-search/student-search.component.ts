import { Component, OnInit } from '@angular/core';
import { StudentService } from '../student.service';
import { SubjectService } from '../subject.service';
import { Student } from '../student.model';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Subject as RxSubject, of } from 'rxjs';

@Component({
  selector: 'app-student-search',
  templateUrl: './student-search.component.html',
  styleUrls: ['./student-search.component.css']
})
export class StudentSearchComponent implements OnInit {
  students: Student[] = [];
  selectedStudent: Student | null = null;
  searchTerms = new RxSubject<string>();
  showSuggestions = false;
  page = 0;
  size = 5;
  currentSearchTerm = '';
  loading = false;

  constructor(private studentService: StudentService, private subjectService: SubjectService) { }

  ngOnInit(): void {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(term => {
        if (term.length >= 2) {
          this.currentSearchTerm = term;
          this.page = 0;
          return this.studentService.searchStudents(term, null, this.page, this.size);
        } else {
          return of({ content: [] });
        }
      })
    ).subscribe(response => {
      if (response && response.content) {
        this.students = response.content;
        this.showSuggestions = true;
      } else {
        this.students = [];
        this.showSuggestions = false;
      }
    });
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerms.next(input.value);
  }

  onFocus(): void {
    if (this.currentSearchTerm.length >= 3) {
      this.showSuggestions = true;
    }
  }

  onBlur(): void {
    setTimeout(() => this.showSuggestions = false, 200);
  }

  onScroll(): void {
    if (this.currentSearchTerm.length >= 2 && !this.loading) {
      this.loading = true;
      this.page++;
      this.studentService.searchStudents(this.currentSearchTerm, null, this.page, this.size)
        .subscribe(response => {
          if (response && response.content) {
            this.students = [...this.students, ...response.content];
          } else {
            console.log('No more data found');
          }
          this.loading = false;
        }, error => {
          console.error('Error fetching more students:', error);
          this.loading = false;
        });
    }
  }

  selectStudent(student: Student): void {
    this.selectedStudent = student;
    this.showSuggestions = false;
  }

  deleteSubject(subjectId?: number): void {
    if (this.selectedStudent && subjectId != null) {
      this.subjectService.deleteSubject(subjectId).subscribe(() => {
        this.selectedStudent!.subjects = this.selectedStudent!.subjects!.filter(subject => subject.id !== subjectId);
      });
    }
  }
}
