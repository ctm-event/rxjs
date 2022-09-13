import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, Subject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Course } from "../model/course";
import { Lesson } from "../model/lesson";
import { createHttpObservable } from "./util";

export enum CourseCategory {
  BEGINNER = "BEGINNER",
  ADVANCED = "ADVANCED",
}

@Injectable({
  providedIn: "root",
})
export class Store {
  private subject: Subject<Course[]> = new BehaviorSubject<Course[]>([]);
  courses$: Observable<Course[]> = this.subject.asObservable();

  init() {
    const http$ = createHttpObservable("/api/courses");
    const courses$: Observable<Course[]> = http$
      .pipe(
        tap(() => console.log("HTTP request executed")),
        map((res) => Object.values(res["payload"]))
      )
      .subscribe((courses) => this.subject.next(courses));
  }

  selectBeginnerCourses() {
    return this.filterByCategory(CourseCategory.BEGINNER);
  }

  selectAdvancedCourses(): Observable<Course[]> {
    return this.filterByCategory(CourseCategory.ADVANCED);
  }

  private filterByCategory(category: CourseCategory) {
    return this.courses$.pipe(
      map((courses) => courses.filter((course) => course.category == category))
    );
  }
}
