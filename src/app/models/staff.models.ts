import { Bank } from "./bank.models";
import { Department } from "./department.models";
import { Designation } from "./designation.models";
import { SalaryStructure } from "./salary-structure.models";
import { StaffClass } from "./staff-class.models";

export class Staff {
  fileToUpload = null;
  constructor(
    public loginId: number = null,
    public deptId: number = null,
    public dsgId: number = null,
    public classId: number = null,
    public salaryStrId: number = null,
    public bankId: number = null,
    public level: number = null,
    public grade: number = null,
    public surname: string = null,
    public firstname: string = null,
    public othername: string = null,
    public gender: string = null,
    public dateOfEmp: string = null,
    public dateOfRet: string = null,
    public accountNo: string = null,
    public imageUrl: string = null,
    public id = null,
    public Bank: Bank = null,
    public Designation: Designation = null,
    public Department: Department = null,
    public StaffClass: StaffClass = null,
    public SalaryStructure: SalaryStructure = null
  ) {}
}
