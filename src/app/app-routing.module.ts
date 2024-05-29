import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddStudentComponent } from './add-student/add-student.component';
import { EditSubjectComponent } from './edit-subject/edit-subject.component';
import { StudentListComponent } from './student-list/student-list.component';
import { StudentSearchComponent } from './student-search/student-search.component';
import { StudentDetailsComponent } from './student-details/student-details.component';

const routes: Routes = [
  { path: 'add-student', component: AddStudentComponent },
  { path: 'edit-subject/:studentId/:subjectId', component: EditSubjectComponent },
  { path: 'add-subject/:studentId', component: EditSubjectComponent },
  { path: 'students', component: StudentListComponent },
  { path: 'search-students', component: StudentSearchComponent },
  { path: 'edit-student/:id', component: AddStudentComponent },
  { path: 'student-details/:id', component: StudentDetailsComponent },
  { path: '', redirectTo: '/students', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

