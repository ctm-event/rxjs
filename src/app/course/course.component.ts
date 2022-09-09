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
} from "rxjs/operators";
import { merge, fromEvent, Observable, concat, of } from "rxjs";
import { Lesson } from "../model/lesson";
import { createHttpObservable } from "../common/util";

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
    this.course$ = createHttpObservable<Course>(`/courses/${this.courseId}`);
  }

  ngAfterViewInit() {
    const searchLessons$ = fromEvent(this.input.nativeElement, "keyup").pipe(
      debounceTime(500),
      distinctUntilChanged(),
      map((event: InputEvent) => (<HTMLInputElement>event.target).value),
      switchMap((search) => this.loadLessons(search))
    );

    const initialLessons$ = this.loadLessons();
    this.lessons$ = concat(initialLessons$, searchLessons$);
  }

  loadLessons(search: string = ""): Observable<Lesson[]> {
    return createHttpObservable<{ payload: Lesson[] }>(
      `/lessons?courseId=${this.courseId}&filter=${search}`
    ).pipe(map((res) => res.payload));
  }
}
