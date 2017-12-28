/**
 * The best way to learn is through the experiences of others, and accessing the databse of past clinical trials
 * often is the best way to glean such information.
 */

import {Component, Input } from "@angular/core";
import { ClinicalTrialsService } from "./clinical-trials.service";
import { ClinicalTrialReference } from "./clinical-trials";
import { Variant } from "../genomic-data";
import {Patient} from "../patient/patient";
import {VariantWrapper} from "../variant-entry-and-visualization.component";
import {isNullOrUndefined} from "util";

@Component({
  selector: "clinical-trials-search",
  template: `    
    <div id="searchSelections">
      <div class="searchParam">
        <p><b>Filters:</b></p>
      </div>
      
      <div class="searchParam">
        <label><input type="checkbox" [(ngModel)]="searchCondition" (ngModelChange)="updateList()"> Conditions</label>
      </div>
      
      <div class="searchParam">
        <label><input type="checkbox" [(ngModel)]="searchGender" (ngModelChange)="updateList()"> Gender</label>
      </div>
      
      <div class="searchParam">
        <label><input type="checkbox" [(ngModel)]="searchAge" (ngModelChange)="updateList()"> Age</label>
      </div>
      
      <div class="searchParam">
        <label><input type="checkbox" [(ngModel)]="searchZipCode" (ngModelChange)="updateList()"> Country</label>
      </div>

      <div class="searchParam">
        <button type="button" class="btn-info" style="border-radius: 5px; margin: 0; height: 40px; margin-top: 5px; line-height: 0px;" (click)="updateList()">Quick Refresh</button>
      </div>
    </div>
    
    <table class="table table-hover table-bordered" style="background-color: white;">
      <thead>
      <tr>
        <th>Clinical Trial ID</th>
        <th>Phase</th>
        <th>Brief Title</th>
        <th>Drugs</th>
        <th>Principal Investigator</th>
      </tr>
      </thead>
      <tbody>
      <ng-container *ngIf="clinicalTrials.length >= 0" >
        <tr *ngFor="let clinicalTrial of clinicalTrials" class="variantRow">
          <td (click)="linkTo('https://www.cancer.gov/about-cancer/treatment/clinical-trials/search/v?id=' + clinicalTrial.nci_id)">{{clinicalTrial.nci_id}}</td>
          <td>{{clinicalTrial.phase}}</td>
          <td>{{clinicalTrial.brief_title}}</td>
          <td>{{clinicalTrial.drugsToString()}}</td>
          <td>{{clinicalTrial.principal_investigator}}</td>
        </tr>
      </ng-container>
      <ng-container *ngIf="clinicalTrials.length === 0" >
        <tr style="text-align: center; padding: 20px;">
          <td>No results found :(</td>
        </tr>
      </ng-container>
      </tbody>
    </table>
  `,
  styles: [`    
    #searchSelections {
      height: 50px;
      width: 100%;
      overflow: hidden;
    }
    
    .searchParam {
      height: 100%;
      width: calc(100% / 6);
      float: left;
      line-height: 50px;
      text-align: center;
    }
  `]
})
export class ClinicalTrialsSearchComponent
{
  constructor (public clinicalTrialsService: ClinicalTrialsService) {}

  // Must be supplied to search for trials.
  @Input() patient: Patient;
  @Input() variants: VariantWrapper[];

  // The additional boolean parameters required to search.
  searchCondition: boolean;
  searchGender: boolean;
  searchAge: boolean;
  searchZipCode: boolean;

  // Clinical trials references.
  clinicalTrials: ClinicalTrialReference[] = [];

  updateList(): void
  {
    let searchString = "";

    if (!isNullOrUndefined(this.patient))
    {
      searchString =
        (this.searchCondition ? this.patient.conditions.join(", ") + " " : "") +
        (this.searchAge ? this.patient.age + " " : "") +
        (this.searchGender ? this.patient.gender + " " : "") +
        (this.searchZipCode ? this.patient.country + " " : "");
    }

    for (const variant of this.variants)
    {
      if (!isNullOrUndefined(variant.variant))
      {
        searchString = searchString + variant.variant.variantName;
      }
    }

    if (searchString === "")
    {
      this.clinicalTrials = [];
      return;
    }

    console.log("Would now search with " + searchString);

    this.clinicalTrialsService.searchClinicalTrials(searchString).subscribe(results => this.clinicalTrials = results);
  }

  linkTo(link: string): void
  {
    window.location.href = link;
  }
}
