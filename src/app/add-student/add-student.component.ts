import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentService } from '../student.service';
import { Student } from '../student.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-student',
  templateUrl: './add-student.component.html'
})
export class AddStudentComponent implements OnInit {
  studentForm: FormGroup;
  students: Student[] = [];
  page = 0;
  size = 10;
  totalPages: number[] = [];

  editingStudentId: number | undefined;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private router: Router
  ) {
    this.studentForm = this.fb.group({
      name: ['', Validators.required],
      roll: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      dateOfBirth: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getStudents(this.page, this.size).subscribe(response => {
      this.students = response.content;
      this.totalPages = Array.from({ length: response.totalPages }, (_, i) => i + 1);
    });
  }

  addStudent() {
    if (this.studentForm.valid) {
      const newStudent = this.studentForm.value as Student;
      this.studentService.addStudent(newStudent).subscribe(student => {
        this.students.push(student); // Add the new student to the array
        this.studentForm.reset(); // Reset the form
      });
    }
  }

  deleteStudent(id: number | undefined) {
    if (id !== undefined) {
      this.studentService.deleteStudent(id).subscribe(() => {
        this.students = this.students.filter(student => student.id !== id);
      });
    }
  }

  addSubject(id: number | undefined) {
    if (id !== undefined) {
      this.router.navigate([`/add-subject/${id}`]);
    }
  }

  // Method to set the form values for editing
  setFormValues(student: Student) {
    this.studentForm.patchValue({
      name: student.name,
      roll: student.roll,
      email: student.email,
      dateOfBirth: student.dateOfBirth
    });
    this.editingStudentId = student.id;
  }

  // Method to handle form submission for editing
  onSubmit() {
    if (this.studentForm.valid && this.editingStudentId !== undefined) {
      const updatedStudent = this.studentForm.value as Student;
      this.studentService.updateStudent(this.editingStudentId, updatedStudent).subscribe(() => {
        const index = this.students.findIndex(student => student.id === this.editingStudentId);
        if (index !== -1) {
          this.students[index] = updatedStudent;
        }
        this.studentForm.reset();
        this.editingStudentId = undefined;
        this.loadStudents(); // Fetch data again after successful edit
      });
    } else {
      this.addStudent(); // Call addStudent method if not editing
    }
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
