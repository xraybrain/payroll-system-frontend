import { SalaryStructureList } from "./salary-structure-list";

export class SalaryStructure {
  inEditMode = false;
  constructor(
    public name: string,
    public shortName: string,
    public id = null,
    public SalaryStructureLists: SalaryStructureList[] = null
  ) {}
}
