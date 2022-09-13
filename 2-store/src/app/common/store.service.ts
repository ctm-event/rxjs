import { Injectable } from "@angular/core";
import { BehaviorSubject, from, Observable } from "rxjs";
import { filter, map, tap } from "rxjs/operators";
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

  selectCourseById(courseId: number): Observable<Course> {
    return this.courses$.pipe(
      map((courses) => {
        return courses.find((course) => course.id === courseId);
      }),
      filter(course => !!course)
    );
  }

  save(courseId: number, changes: Course) {
    const courses = this.subject.getValue();
    console.log("courseId", courseId);

    const courseIndex = courses.findIndex((course) => {
      console.log("course.id", course.id);

      return course.id === courseId;
    });

    const newCourses = courses.slice(0);
    newCourses[courseIndex] = {
      ...courses[courseIndex],
      ...changes,
    };

    return from(
      fetch("/api/courses/" + courseId, {
        method: "PUT",
        body: JSON.stringify(changes),
        headers: {
          "content-type": "application/json",
        },
      }).then((res) => {
        if (res.ok) {
          this.subject.next(newCourses);
        }
        return res;
      })
    );
  }

  private filterByCategory(category: CourseCategory): Observable<Course[]> {
    return this.courses$.pipe(
      map((courses) => courses.filter((course) => course.category == category))
    );
  }
}
