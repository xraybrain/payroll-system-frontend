import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  faList,
  faListAlt,
  faPlusCircle,
  faThList,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { ViewModes } from "src/app/models/app-enums";

@Component({
  selector: "app-manage-salary-structure",
  templateUrl: "./manage-salary-structure.component.html",
  styleUrls: ["./manage-salary-structure.component.css"],
})
export class ManageSalaryStructureComponent implements OnInit {
  faList = faList;
  faPlusCircle = faPlusCircle;
  faTimes = faTimes;
  faListAlt = faListAlt;

  isEditMode: boolean;
  isMainMode: boolean;
  isNewItemMode: boolean;

  constructor(public route: ActivatedRoute) {
    let mode = route.snapshot.params["mode"];
    if (mode === "new") {
      this.setViewMode(ViewModes.NewItemView);
    } else {
      this.setViewMode(ViewModes.MainView);
    }
  }

  setViewMode(mode: ViewModes) {
    this.isEditMode = mode === ViewModes.EditView;
    this.isMainMode = mode === ViewModes.MainView;
    this.isNewItemMode = mode === ViewModes.NewItemView;
  }

  onBackToMain() {
    this.setViewMode(ViewModes.MainView);
  }

  ngOnInit() {}
}
