import { Injectable } from "@angular/core";
import { BehaviorSubject, from, Observable } from "rxjs";
import { map, tap } from "rxjs/operators";
import { Course } from "../model/course";
import { createHttpObservable } from "./util";

export enum CourseCategory {
  BEGINNER = "BEGINNER",
  ADVANCED = "ADVANCED",
}

@Injectable({
  providedIn: "root",
})
export class Store {
  private subject: BehaviorSubject<Course[]> = new BehaviorSubject<Course[]>(
    []
  );
  courses$: Observable<Course[]> = this.subject.asObservable();

  init() {
    const http$ = createHttpObservable("/api/courses");
    http$
      .pipe(
        tap(() => console.log("HTTP request executed")),
        map((res) => Object.values(res["payload"]))
      )
      .subscribe((courses) => this.subject.next(courses));
  }

  selectBeginnerCourses(): Observable<Course[]> {
    return this.filterByCategory(CourseCategory.BEGINNER);
  }

  selectAdvancedCourses(): Observable<Course[]> {
    return this.filterByCategory(CourseCategory.ADVANCED);
  }

  save(courseId: number, changes: Course) {
    const courses = this.subject.getValue();
    const courseIndex = courses.findIndex((course) => {
      course.id === courseId;
    });

    const newCourses = courses.slice(0);
    newCourses[courseIndex] = {
      ...courses[courseIndex],
      ...changes,
    };
    console.log("new change", newCourses);

    setTimeout(() => {

      this.subject.next(newCourses);
    }, 1000)

    return from(
      fetch("/api/courses/" + courseId, {
        method: "PUT",
        body: JSON.stringify(changes),
        headers: {
          "content-type": "application/json",
        },
      })
    );
  }

  private filterByCategory(category: CourseCategory): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses) => courses.filter((course) => course.category == category))
    );
  }
}
