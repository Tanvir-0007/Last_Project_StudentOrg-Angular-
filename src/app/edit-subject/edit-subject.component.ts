import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SubjectService } from '../subject.service';
import { Subject } from '../subject.model';

@Component({
  selector: 'app-edit-subject',
  templateUrl: './edit-subject.component.html'
})
export class EditSubjectComponent implements OnInit {
  subjectForm: FormGroup;
  subjectId: number | undefined;
  studentId: number | undefined;

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.subjectForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.studentId = +this.route.snapshot.paramMap.get('studentId')!;
    this.subjectId = this.route.snapshot.paramMap.has('subjectId') ? +this.route.snapshot.paramMap.get('subjectId')! : undefined;
    if (this.subjectId) {
      this.loadSubject();
    }
  }

  loadSubject() {
    this.subjectService.getSubjectById(this.subjectId!).subscribe(subject => {
      this.subjectForm.patchValue(subject);
    });
  }

  saveSubject() {
    if (this.subjectForm.valid) {
      const updatedSubject = this.subjectForm.value as Subject;
      if (this.subjectId) {
        this.subjectService.updateSubject(this.subjectId, updatedSubject).subscribe(() => {
          this.router.navigate(['/students']);
        });
      } else if (this.studentId !== undefined) {
        this.subjectService.addSubjectToStudent(this.studentId, updatedSubject).subscribe(() => {
          this.router.navigate(['/students']);
        });
      }
    }
  }
}
