export class Miscellanous {
  constructor(
    public level: number = null,
    public classId: number = null,
    public title: string = null,
    public percent: number = null,
    public derivedFrom: string = "consolidated",
    public isCalculated: boolean = false,
    public amount: number = 0,
    public category: number = null,
    public genderRestricted: string = null,
    public id: number = null
  ) {}
}
