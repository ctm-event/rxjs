import { Component, OnDestroy, OnInit } from "@angular/core";
import { concat, interval, merge, noop, of, Subscription } from "rxjs";
import { map, mergeMap } from "rxjs/operators";
import { createHttpObservable } from "../common/util";

@Component({
  selector: "about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit, OnDestroy {
  subscriptions: Subscription = new Subscription();

  constructor() {}

  ngOnInit() {
    const interval1$ = interval(1000);
    const interval2$ = interval1$.pipe(map(val => 10 * val));
    const result$ = merge(interval1$, interval2$);

    result$.subscribe(console.log);

  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
