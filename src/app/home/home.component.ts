import { Component, OnInit } from "@angular/core";
import { noop, Observable } from "rxjs";
import { map, shareReplay, tap } from "rxjs/operators";
import { createHttpObservable } from "../common/util";
import { Course } from "../model/course";

@Component({
  selector: "home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  beginnerCourses$: Observable<Course[]>;
  advancedCourses$: Observable<Course[]>;

  constructor() {}

  ngOnInit() {
    const $http = createHttpObservable("/courses");
    const $course = $http.pipe(
      shareReplay(),
      map((res) => Object.values(res["payload"])),
      tap((res) => console.log("Http request executed.")),
    );

    this.beginnerCourses$ = $course.pipe(
      map((courses: Course[]) =>
        courses.filter((course) => course.category === "BEGINNER")
      )
    );
    this.advancedCourses$ = $course.pipe(
      map((courses: Course[]) =>
        courses.filter((course) => course.category === "ADVANCED")
      )
    );
  }
}