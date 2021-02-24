import { Miscellanous } from "./miscellanous.models";
import { SalaryMisc } from "./salary-misc";
import { Staff } from "./staff.models";

export class Salary {
  constructor(
    public status: string,
    public bankId: number,
    public payrollId: number,
    public staffId: number = null,
    public consolidated: number = null,
    public grossPay: number = null,
    public totalDeducted: number = null,
    public netPay: number = null,
    public id = null,
    public Staff: Staff = null,
    public Miscellanous: Miscellanous[] = null,
    public SalaryMiscellanous: SalaryMisc[] = null
  ) {}
}
