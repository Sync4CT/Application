import {Component, OnInit} from "@angular/core";
import {BehaviorSubject} from "rxjs/BehaviorSubject";

// Items can subscribe and act depending on what was decided.
export let USE_S4S_Sample: BehaviorSubject<Boolean> = new BehaviorSubject<Boolean>(null);

@Component({
  selector: "launch-from-s4s",
  template: `
    <div>
      <input type="button" class="btn btn-primary" (click)="launchFromS4S()" value="Use S4S Data">
    </div>
  `,
  styles: [`
    div {
      display: block;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 50;
      background-color: black;
      border-radius: 25px;
    }
    
    * {
      height: 50px;
    }
  `]
})
export class LaunchFromS4SComponent implements OnInit
{
  ngOnInit(): void
  {
    USE_S4S_Sample.next(false);
  }

  launchFromS4S(): void
  {
    USE_S4S_Sample.next(true);
  }
}
