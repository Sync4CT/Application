import {Component} from "@angular/core";

@Component({
  selector: "launch-from-s4s",
  template: `
    <div>
      <input type="button" class="btn btn-default" (click)="launchFromS4S()" value="Launch from S4S (broken)">
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
export class LaunchFromS4SComponent
{
  launchFromS4S(): void
  {
    window.location.href = "https://sync4ct.github.io/smart-launch?launch=1234&iss=https://portal.demo.syncfor.science/api/open-fhir";
  }
}
