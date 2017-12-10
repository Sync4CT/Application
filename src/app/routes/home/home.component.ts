/**
 * The landing page for the app, which tells the user what the app does, what the purpose of the appis, and why
 */
import { Component } from "@angular/core";
import { trigger, state, style, animate, transition } from "@angular/animations";
import { Router } from "@angular/router";

@Component({
  selector: "home",
  template: `
    <div class="infoCard">
      <div class="cardContent">
        <div>
          <h1 class="thinFont1">Project Purpose</h1>
          <hr>
          <p class="thinFont1">Matching patients with the clinical trials that are most appropriate to their genome and situation has long since been one of the key components in the success of such trials.  What if it were possible to accomplish this automatically?  We plan to accomplish this using the Sync4Science initiative and SMART on FHIR.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .infoCard {
      margin: 10px 5px;
      overflow: hidden;
    }

    .cardContent {
      float: left;
    }

    .cardImage {
      float: left;
      width: 30%;
      min-width: 150px;
      max-width: 100%;
    }

    .cardImage > div, .cardContent > div {
      float: left;
      background-color: #393939;
      box-shadow: 1px 3px #242424;
      border: 1px solid #292929;
      color: white;
      padding: 15px;
      margin: 7px 3px;
    }

    .cardImage img {
      width: 100%;
      height: auto;
    }
  `],
  animations: [
  ]
})
export class LandingPageComponent {
  constructor (private router: Router) {}
}
