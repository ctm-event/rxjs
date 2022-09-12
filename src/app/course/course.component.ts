import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Course } from "../model/course";
import {
  debounceTime,
  distinctUntilChanged,
  startWith,
  tap,
  delay,
  map,
  concatMap,
  switchMap,
  withLatestFrom,
  concatAll,
  shareReplay,
  filter,
  throttle,
  throttleTime

} from "rxjs/operators";
import {
  merge,
  fromEvent,
  Observable,
  concat,
  of,
  timer,
  interval,
  forkJoin,
} from "rxjs";
import { Lesson } from "../model/lesson";
import { createHttpObservable } from "../common/util";
import { debug, RxJsLogginfLevel } from "../common/debug";

@Component({
  selector: "course",
  templateUrl: "./course.component.html",
  styleUrls: ["./course.component.css"],
})
export class CourseComponent implements OnInit, AfterViewInit {
  course$: Observable<Course>;
  lessons$: Observable<Lesson[]>;
  courseId: string;

  @ViewChild("searchInput", { static: false }) input: ElementRef;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.params["id"];
    this.course$ = createHttpObservable<Course>(
      `/courses/${this.courseId}`
    );
    const lessons$ = this.loadLessons();

    forkJoin([this.course$, lessons$])
      .pipe(
        tap(([courses, lessons]) => {
          console.log(courses);
          console.log(lessons);
        })
      )
      .subscribe();
  }

  ngAfterViewInit() {
    this.lessons$ = fromEvent(this.input.nativeElement, "keyup").pipe(
      map((event: InputEvent) => (<HTMLInputElement>event.target).value),
      debounceTime(400),
      switchMap((search) => this.loadLessons(search)),
      debug(RxJsLogginfLevel.INFO, "search"),
    );

    // const initialLessons$ = this.loadLessons();
    // this.lessons$ = concat(searchLessons$);
  }

  loadLessons(search: string = ""): Observable<Lesson[]> {
    return createHttpObservable<{ payload: Lesson[] }>(
      `/lessons?courseId=${this.courseId}&filter=${search}`
    ).pipe(map((res) => res.payload));
  }
}
