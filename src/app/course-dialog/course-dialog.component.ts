import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as moment from "moment";
import { Course } from "../model/course";
import { filter, concatMap, exhaustMap, switchMap } from "rxjs/operators";
import { from, fromEvent, Observable } from "rxjs";

@Component({
  selector: "course-dialog",
  templateUrl: "./course-dialog.component.html",
  styleUrls: ["./course-dialog.component.css"],
})
export class CourseDialogComponent implements OnInit, AfterViewInit {
  form: FormGroup;
  course: Course;

  @ViewChild("saveButton", { static: true }) saveButton: ElementRef;

  @ViewChild("searchInput", { static: true }) searchInput: ElementRef;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CourseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) course: Course
  ) {
    this.course = course;

    this.form = fb.group({
      description: [course.description, Validators.required],
      category: [course.category, Validators.required],
      releasedAt: [moment(), Validators.required],
      longDescription: [course.longDescription, Validators.required],
    });
  }

  ngOnInit() {
    this.form.valueChanges
      .pipe(
        filter(() => this.form.valid),
        concatMap((changes) => {
          return this.saveCourse(changes);
        })
      )
      .subscribe();
  }

  saveCourse(changes) {
    return from(
      fetch(`api/courses/${this.course.id}`, {
        method: "PUT",
        body: JSON.stringify(changes),
        headers: {
          "content-type": "application/json",
        },
      })
    );
  }

  ngAfterViewInit() {
    fromEvent(this.saveButton.nativeElement, "click").pipe(
      exhaustMap(() => {
        return this.saveCourse(this.form.value);
      })
    ).subscribe(console.log);
  }

  close() {
    this.dialogRef.close();
  }
}
