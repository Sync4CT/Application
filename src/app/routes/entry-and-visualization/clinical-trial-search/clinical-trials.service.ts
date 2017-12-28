/**
 * The clinical trials API provides a method through which one can glean data obtained via clinicaltrials.gov.
 * Note that the API is available at clinicaltrialsapi.cancer.gov instead.
 */
import { Variant } from "../genomic-data";
import { Observable } from "rxjs/Observable";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ClinicalTrialReference, ClinicalTrial } from "./clinical-trials";
import { Drug, DrugReference } from "../variant-visualization/drugs/drug";

/**
 * Based on the Angular and RxJS documentation, this is the best way to deal with sequential HTTP requests (those
 * that have results which vary based on the results to prior queries).
 */
import "rxjs/add/operator/mergeMap";
import {Patient} from "../patient/patient";

/**
 * Both searches for and provides data for different clinical trials.
 */
@Injectable()
export class ClinicalTrialsService
{
  constructor (public http: HttpClient) {}

  // Reduces typing involved :P
  queryEndpoint = "https://clinicaltrialsapi.cancer.gov/v1/clinical-trials?";

  /**
   * What I"m trying to do for this method is obtain some examples of clinical trials being carried out on the
   * variants (also gene, but preferably variants) that the user filled out.  We get a max of 10 clinical trials
   * for each gene/variant combo.  The priority trials go to the variant (we query based on name, then HGVS ID),
   * and then finally we query for trials that involved this gene if that doesn"t work out.
   */
  searchClinicalTrials = (searchString: string): Observable<ClinicalTrialReference[]> => {
    // Gets a list of clinical trial references from the single JSON object.
    const clinicalTrialJSONtoReferences = (jsonObject: Object): ClinicalTrialReference[] => {
      const references: ClinicalTrialReference[] = [];
      for (const trial of jsonObject["trials"]) {
        const drugsArray: DrugReference[] = [];
        for (const intervention of trial.arms[0].interventions) {
          if (intervention.intervention_type === "Drug") {
            const newDrug = new DrugReference(intervention.intervention_name);
            drugsArray.push(newDrug);
          }
        }
        references.push(new ClinicalTrialReference(trial.nci_id, trial.phase.phase, trial.brief_title, drugsArray, trial.principal_investigator));
      }

      return references;
    };

    // Requirements before constructing queries.
    const desiredTrials: number = 10;
    const includes: string[] = ["brief_title", "nci_id", "principal_investigator", "phase.phase", "arms"];

    // Determine includes.
    let includeString = "";
    for (const include of includes) {
      includeString = includeString + "&include=" + include;
    }

    // 1. Query for variant name in the clinical trials database.
    return this.http
      .get(this.queryEndpoint + "size=" + desiredTrials + "&_fulltext=" + searchString + includeString)
      .map(result1 => {
        console.log("1. Got name query results:", result1);

        return clinicalTrialJSONtoReferences(result1);
      });
  }
}
