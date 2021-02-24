import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  faList,
  faPlusCircle,
  faThList,
  faTimes,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { ViewModes } from "src/app/models/app-enums";

@Component({
  selector: "app-manage-staff",
  templateUrl: "./manage-staff.component.html",
  styleUrls: ["./manage-staff.component.css"],
})
export class ManageStaffComponent implements OnInit {
  faList = faList;
  faPlusCircle = faPlusCircle;
  faTimes = faTimes;
  faThList = faThList;
  faUser = faUser;
  faUsers = faUsers;

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
