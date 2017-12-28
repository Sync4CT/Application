/**
 * A reference to the patient's data.
 */
export class Patient
{
  constructor (rawData: Object, name: string, gender: string, alive: boolean, age: number, country: string, conditions: string[])
  {
    this.rawData = rawData;
    this.name = name;
    this.gender = gender;
    this.alive = alive;
    this.age = age;
    this.country = country;
    this.conditions = conditions;
  }

  rawData: Object;
  name: string;
  gender: string;
  alive: boolean;
  age: number;
  country: string;
  conditions: string[];
}
