export class Department {
  inEditMode = false;
  constructor(
    public name: string,
    public id = null,
    public Designations = []
  ) {}
}
