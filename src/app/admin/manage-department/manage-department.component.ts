import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faList, faListAlt, faPiggyBank, faPlusCircle, faThList, faTimes } from '@fortawesome/free-solid-svg-icons';
import { ViewModes } from 'src/app/models/app-enums';

@Component({
  selector: 'app-manage-department',
  templateUrl: './manage-department.component.html',
  styleUrls: ['./manage-department.component.css']
})
export class ManageDepartmentComponent implements OnInit {
  faListAlt = faListAlt;
  faPlusCircle = faPlusCircle;
  faTimes = faTimes;
  faThList = faThList;

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
  ngOnInit() {
  }

}
