import { Component, OnInit } from "@angular/core";
import { Variant } from "./genomic-data";
import { SMARTClient } from "../../smart-initialization/smart-reference.service";
import { VariantSelectorService } from "./variant-selector/variant-selector.service";
import { trigger, state, style, animate, transition } from "@angular/animations";
import { Router } from "@angular/router";
import { isNullOrUndefined } from "util";
import {Patient} from "./patient/patient";
import {HttpClient} from "@angular/common/http";

export class VariantWrapper
{
  constructor(_index: number, _variant: Variant) {
    this.index = _index;
    this.variant = _variant;
    this.drawerState = "closed";
    this.saved = false;
  }

  variant: Variant;
  index: number;
  drawerState: string; // Open or closed.
  saved: boolean;

  public toggleDrawer = () => {
    this.drawerState = this.drawerState === "closed" ? "open" : "closed";
  }
}

@Component({
  selector: "variant-entry-and-visualization",
  template: `
    <div id="patientLinkState">
      <!-- If an EHR link is NOT detected -->
      <div id="suggestEHRLink" *ngIf="offerToLinkToEHRInstructions">
        <div id="suggestions">
          <img src="/assets/entry-and-visualization/info-icon.png">
          <p class="thinFont1">You don't seem to be connected to an EHR! <a href="javascript:void(0)" (click)="routeToInstructions()">Learn how here.</a></p>
        </div>
        <button class="btn btn-danger" (click)="offerToLinkToEHRInstructions = false">X</button>
      </div>

      <!-- If an EHR link is detected -->
      <div id="patientInfo" *ngIf="patient !== null"
           [style.background-color]="patient.gender === 'male' ? '#27384f' : '#ff45f7'">
        <img
          [src]="patient.gender === 'male' ? '/assets/entry-and-visualization/male-icon.png' : '/assets/entry-and-visualization/female-icon.png'">

        <!-- Patient Details -->
        <p style="color: white">
          <b>Name: </b> {{patient.name}} |
          <b>{{patient.alive ? 'Lives in' : 'Lived in'}}:</b> {{patient.country}} | <b>Age:</b> {{patient.age}} |
          <b>Condition:</b>
          <select style="font-size: 15px;">
            <option *ngFor="let condition of patient.conditions">{{condition}}</option>
          </select>
        </p>

        <div id="autosyncToggle">
          <div>
            <ui-switch [ngModel]="autosync" (ngModelChange)="onToggleAutosync($event)"></ui-switch>
            <p class="thinFont1" style="color: white">Auto-Sync</p>
          </div>
        </div>
      </div>
    </div>

    <div id="contentWrapper">
      <ngb-tabset>
        <ngb-tab title="Edit Associated Variants">
          <ng-template ngbTabContent>

            <!-- Variant Visualizations -->
            <div id="variantVisualizations">
              <div class="variantWrapper" *ngFor="let variant of variants; let i = index">
                <div class="variantSelector">
                  <div [style.width]="i === variants.length - 1 ? '100%' : 'calc(100% - 38px)'">
                    <variant-selector [ngModel]="variant.variant"
                                      (ngModelChange)="variant.variant = $event; addRowMaybe(i); saveEHRVariant(variant);"></variant-selector>
                  </div>
                  <button class="removeRowButton btn btn-danger" (click)="removeRow(i)"
                          *ngIf="i !== variants.length - 1">X
                  </button>
                </div>
                <div>
                  <div class="visualizationContent" [@drawerAnimation]="variant.drawerState">
                    <variant-visualization [(ngModel)]="variant.variant"></variant-visualization>
                  </div>
                  <div *ngIf="variant.variant !== undefined && variant.variant !== null" class="informationToggle"
                       (click)="variant.toggleDrawer()">
                    <img src="/assets/entry-and-visualization/dropdown.svg">
                  </div>
                </div>
              </div>
            </div>
          </ng-template>
        </ngb-tab>
        
        <ngb-tab title="Clinical Trial Search">
          <ng-template ngbTabContent>
            <clinical-trials-search [patient]="patient" [variants]="variants"></clinical-trials-search>
          </ng-template>
        </ngb-tab>

      </ngb-tabset>
    </div>

    <!-- Whether to use Sync4Science patient data -->
    <div id="bottomRight" *ngIf="!usingS4S">
      <input type="button" class="btn btn-primary" (click)="useS4S()" value="Use S4S Data">
    </div>
  `,
  styles: [`
    p {
      margin: 0;
    }

    #patientLinkState {
      margin-left: 6%;
      margin-right: 6%;
    }

    #suggestEHRLink {
      height: 80px;
      width: 100%;

      background-color: rgb(255, 189, 44);
      overflow: hidden;
    }

    #suggestEHRLink > * {
      float: left;
    }

    #suggestEHRLink > #suggestions {
      display: flex;
      justify-content: center;
      align-items: center;
      width: calc(100% - 60px);
      height: 100%;
    }

    #suggestEHRLink img {
      width: 60px;
      height: 60px;
      margin: 1% 10px;
    }

    #suggestEHRLink p {
      width: calc(96% - 80px);
      margin: 1%;
      font-size: 20px;
      color: black;
    }

    #suggestEHRLink button {
      width: 60px;
      height: 30px;
      color: white;
      font-size: 15px;
      border-radius: 0;
      padding: 0;
    }

    #patientLinkState > div {
      border-bottom-left-radius: 30px;
      border-bottom-right-radius: 30px;
    }

    #patientInfo {
      display: flex;
      justify-content: center;
      align-items: center;

      height: 80px;
      width: 100%;

      overflow: hidden;

      text-align: center;
    }

    #patientInfo img {
      width: 60px;
      height: 60px;
      margin: 10px;
    }

    #patientInfo p {
      width: calc(96% - 280px);
      margin: 1%;
      font-size: 20px;
      color: black;
    }

    #autosyncToggle {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 200px;
      height: 100%;
    }

    #autosyncToggle > div {
      width: 100%;
    }

    #autosyncToggle > div > p {
      width: 100%;
    }

    #contentWrapper {
      background-color: white;
      border-radius: 5px;
      margin-top: 2%;
      margin-left: 4%;
      margin-right: 4%;
    }

    #variantVisualizations {
      padding: 15px;
      background-color: #ffffff;
    }

    .variantWrapper {
      margin-bottom: 5px;
    }

    .variantSelector {
      height: 38px;
    }

    .variantSelector > * {
      float: left;
      height: 100%;
    }

    .removeRowButton {
      width: 38px;
      font-size: 20px;
      color: white;
      padding: 0;
    }

    .informationToggle {
      width: 100%;
      background-color: #e2e2e2;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
      text-align: center;
      height: 30px;
    }

    .visualizationContent {
      overflow: scroll;
    }

    .informationToggle:hover {
      background-color: #b2b2b2;
    }

    .informationToggle img {
      height: 10px;
      width: 10px;
      margin: 10px;
    }
    
    #bottomRight {
      display: block;
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 50;
      background-color: black;
      border-radius: 25px;
    }
  `],
  animations: [
    trigger("drawerAnimation", [
      state("closed", style({
        height: "0"
      })),
      state("open", style({
        height: "700px"
      })),
      transition("closed => open", animate("400ms ease-in-out")),
      transition("open => closed", animate("400ms ease-in-out"))
    ])
  ]
})
export class VariantEntryAndVisualizationComponent implements OnInit
{
  constructor (private selectorService: VariantSelectorService, private router: Router, private http: HttpClient) {}

  // Variables required in order to get relevant clinical trials.
  variants: VariantWrapper[] = [];
  patient: Patient = null;

  // Depends on whether we are already linked to the EHR.
  offerToLinkToEHRInstructions = true;
  autosync: boolean = true;

  // Whether to use the S4S thing.
  usingS4S: boolean = false;
  useS4S(): void
  {
    this.usingS4S = true;

    this.offerToLinkToEHRInstructions = false;

    let selectedPatient = "";

    // Get the available patients
    this.http.get("https://portal.demo.syncfor.science/api/open-fhir/Patient")
      .subscribe(patientsJSON =>
      {
        const patients: string[] = [];

        const patientsList: Object = patientsJSON;
        if (isNullOrUndefined(patientsList["entry"]))
          return;
        patientsList["entry"].forEach(patient => {
          patients.push(patient.resource.id);
        });

        selectedPatient = prompt("Please select patient from " + patients.join(", "));

        if (selectedPatient === "")
          return;

        // Once patient's been selected, do all the data reception stuff for him/her!
        this.http.get("https://portal.demo.syncfor.science/api/open-fhir/Patient/" + selectedPatient)
          .subscribe(patientJSON => this.parsePatientJSON(patientJSON));
      });
  }

  /**
   * Once initialized, we'll init the Patient, his/her conditions, and everything else that we need prior to allowing
   * user input.
   */
  ngOnInit()
  {
    // Add a new variant.
    this.addRow();

    // As soon as the smart client is loaded from the SMART JS library, this creates the patient info header and populates the patient variants.
    SMARTClient.subscribe(smartClient =>
    {
      // Don't do anything if we aren't provided a SMART on FHIR client.
      if (smartClient === null)
        return;

      this.offerToLinkToEHRInstructions = false;

      // Get all patient information.
      smartClient.patient.read().then(p => this.parsePatientJSON(p));

      // Get all genomic variants attached to this patient.
      smartClient.patient.api.search({type: "Observation", query: {"category": "genomic-variant"}, count: 10})
        .then(results => this.parseGenomicVariants(results))
        .fail(err => console.log("Couldn't query genomic variants error!", err));

      // Get all conditions for this patient.
      smartClient.patient.api.search({type: "Condition"})
        .then(results => this.parsePatientConditions(results))
        .fail(err => {
          console.log("The query for patient conditions failed!", err);
        });
    });
  }

  /**
   * Parses the patient JSON (either from SMART or the S4S sample patient.
   * @param {Object} patientJSON
   */
  parsePatientJSON(patientJSON: Object): void
  {
    // Raw JSON for the patient.
    console.log("Patient JSON is is ", patientJSON);

    // Figure out patient age.
    let patientAge = -1;
    if (patientJSON["birthDate"] && patientJSON["active"])
    {
      const birthDateValues = patientJSON["birthDate"].split("-");
      const timeDiff = Math.abs(Date.now() - new Date(parseInt(birthDateValues[0]), parseInt(birthDateValues[1]), parseInt(birthDateValues[2])).getTime());
      // Used Math.floor instead of Math.ceil so 26 years and 140 days would be considered as 26, not 27.
      patientAge = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365);
    }

    // Construct the patient object.
    this.patient = new Patient(
      patientJSON,
      patientJSON["name"][0].given[0] + " " + patientJSON["name"][0].family,
      patientJSON["gender"],
      patientJSON["active"],
      patientAge,
      patientJSON["address"][0].country,
      []);
  }

  /**
   * Parses the variants obtained by querying for genomic-variants.
   * @param {Object} results
   */
  parseGenomicVariants(results: Object): void
  {
    console.log("Successfully got variants!", results);

    if (!results["data"].entry)
      return;

    if (results["data"].entry.length > 0)
      this.removeRow(0); // Start at the first index if we find other variants.

    // For every variant.
    let resultIndex = 0;
    for (const result of results["data"].entry)
    {
      console.log("Will now add " + result.resource.code.text);
      this.selectorService.search(result.resource.code.text).subscribe(variants =>
      {
        if (variants.length === 0)
        {
          console.log("NOT GOOD: Couldn't find any search results for " + result.resource.code.text);
          return;
        }

        // Add the first search result to the list (the one with the correct HGVS ID).
        console.log("Adding", variants[0]);

        this.selectorService.getByReference(variants[0])
          .subscribe(variant => {
            const newWrapper = new VariantWrapper(resultIndex, variant);
            if (this.variants.length === resultIndex) {
              this.variants.push(newWrapper);
            } else {
              this.variants[resultIndex] = newWrapper;
            }
            resultIndex++;
          });
      });
    }
  }

  /**
   * Parses the Condition resources of the patient.
   * @param {Object} conditionsJSON
   */
  parsePatientConditions(conditionsJSON: Object): void
  {
    console.log("Got patient conditions:", conditionsJSON);

    if (!isNullOrUndefined(conditionsJSON["data"].entry) && conditionsJSON["data"].entry.length > 0) {
      for (const entry of conditionsJSON["data"].entry) {
        if (!isNullOrUndefined(entry.resource)) {
          if (!isNullOrUndefined(entry.resource.code)) {
            if (!isNullOrUndefined(entry.resource.code.text)) {
              this.patient.conditions.push(entry.resource.code.text);
              console.log("Added " + entry.resource.code.text);
            }
          }
        }
      }
    }

  }

  // Row management.
  addRow() {
    this.variants.push(new VariantWrapper(this.variants.length, null));
  }
  addRowMaybe(indexInQuestion: number) {
    if (this.variants.length === indexInQuestion + 1) {
      this.addRow();
    }
  }
  removeRow(index: number) {
    const variantToRemove = this.variants[index].variant;

    this.variants.splice(index, 1);

    for (let i = 0; i < this.variants.length; i++) {
      this.variants[i].index = i;
    }

    this.removeEHRVariant(variantToRemove);
  }

  routeToInstructions() {
    this.router.navigate(["ehr-link"]);
  }

  onToggleAutosync(newVal: boolean) {
    this.autosync = newVal;

    if (this.autosync) {
      for (const variant of this.variants) {
        if (!variant.saved) {
          this.saveEHRVariant(variant);
        }
      }
    }
  }

  // Remove and save EHR variants.
  saveEHRVariant(variant: VariantWrapper) {
    if (!this.autosync) {
      return;
    }

    SMARTClient.subscribe(smartClient => {
      if (smartClient === null) {
        return;
      }

      smartClient.patient.read().then((p) => {
        const dataToTransmit = {
          "resource": {
            "resourceType": "Observation",
            "id": "SMART-Observation-" + p.identifier[0].value + "-variation-" + variant.variant.hgvsID.replace(/[.,\/#!$%\^&\*;:{}<>=\-_`~()]/g, ""),
            "meta": {
              "versionId": "1" // ,
              // "lastUpdated": Date.now().toString()
            },
            "text": {
              "status": "generated",
              "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Variation at " + variant.variant.getLocation() + "</div>"
            },
            "status": "final",
            "extension": [
              {
                "url": "http://hl7.org/fhir/StructureDefinition/observation-geneticsGene",
                "valueCodeableConcept": {
                  "coding": [
                    {
                      "system": "http://www.genenames.org",
                      "code": "12014",
                      "display": "TPMT"
                    }
                  ]
                }
              }
            ],
            "category": [
              {
                "coding": [
                  {
                    "system": "http://hl7.org/fhir/observation-category",
                    "code": "genomic-variant",
                    "display": "Genomic Variant"
                  }
                ],
                "text": "Genomic Variant"
              }
            ],
            "code": {
              "coding": [
                {
                  "system": "http://www.hgvs.org",
                  "code": variant.variant.hgvsID,
                  "display": variant.variant.hgvsID
                }
              ],
              "text": variant.variant.hgvsID
            },
            "subject": {
              "reference": "Patient/" + p.id
            },
            // "effectiveDateTime": Date.now().toString(),
            // "valueQuantity": {
            //   "value": 41.1,
            //   "unit": "weeks",
            //   "system": "http://unitsofmeasure.org",
            //   "code": "wk"
            // },
            // "context": {}
          }
        };

        console.log("Adding variant with", dataToTransmit);
        smartClient.api.update(dataToTransmit)
          .then(result => {
            console.log("Added EHR variant successfully!", result);
            variant.saved = true;
          })
          .fail(err => {
            console.log("Failed to add EHR variant", err);
          });
      });
    });
  }
  removeEHRVariant(variant: Variant) {
    if (!this.autosync)
      return;

    SMARTClient.subscribe(smartClient => {
      // We can't do anything without a smartClient!
      if (smartClient === null)
        return;

      smartClient.patient.read().then((p) => {
        const dataToTransmit = {
          "resource": {
            "resourceType": "Observation",
            "id": "SMART-Observation-" + p.identifier[0].value + "-variation-" + variant.hgvsID.replace(/[.,\/#!$%\^&\*;:{}<>=\-_`~()]/g, ""),
            "meta": {
              "versionId": "1" // ,
              // "lastUpdated": Date.now().toString()
            },
            "text": {
              "status": "generated",
              "div": "<div xmlns=\"http://www.w3.org/1999/xhtml\">Variation at " + variant.getLocation() + "</div>"
            },
            "status": "final",
            "extension": [
              {
                "url": "http://hl7.org/fhir/StructureDefinition/observation-geneticsGene",
                "valueCodeableConcept": {
                  "coding": [
                    {
                      "system": "http://www.genenames.org",
                      "code": "12014",
                      "display": "TPMT"
                    }
                  ]
                }
              }
            ],
            "category": [
              {
                "coding": [
                  {
                    "system": "http://hl7.org/fhir/observation-category",
                    "code": "genomic-variant",
                    "display": "Genomic Variant"
                  }
                ],
                "text": "Genomic Variant"
              }
            ],
            "code": {
              "coding": [
                {
                  "system": "http://www.hgvs.org",
                  "code": variant.hgvsID,
                  "display": variant.hgvsID
                }
              ],
              "text": variant.hgvsID
            },
            "subject": {
              "reference": "Patient/" + p.id
            },
            // "effectiveDateTime": Date.now().toString(),
            // "valueQuantity": {
            //   "value": 41.1,
            //   "unit": "weeks",
            //   "system": "http://unitsofmeasure.org",
            //   "code": "wk"
            // },
            // "context": {}
          }
        };

        console.log("Removing variant with", dataToTransmit);
        smartClient.api.delete(dataToTransmit)
          .then(result => {
            console.log("Removed EHR variant successfully!", result);
          })
          .fail(err => {
            console.log("Failed to remove EHR variant", err);
          });
      });
    });
  }
}
