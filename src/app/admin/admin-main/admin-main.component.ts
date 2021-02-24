import { Component, OnInit } from "@angular/core";
import {
  faAlignLeft,
  faBars,
  faChevronCircleDown,
  faFile,
  faFileAlt,
  faHistory,
  faIdCard,
  faListAlt,
  faMoneyCheckAlt,
  faPiggyBank,
  faPlusCircle,
  faPowerOff,
  faTh,
  faUserFriends,
  faUserPlus,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-admin-main",
  templateUrl: "./admin-main.component.html",
  styleUrls: ["./admin-main.component.css"],
})
export class AdminMainComponent implements OnInit {
  faTh = faTh;
  faUsers = faUsers;
  faUserFriends = faUserFriends;
  faFileAlt = faFileAlt;
  faIdCard = faIdCard;
  faPowerOff = faPowerOff;
  faBars = faBars;
  faAlignLeft = faAlignLeft;
  faHistory = faHistory;
  faChevronCircleDown = faChevronCircleDown;
  faUserPlus = faUserPlus;
  faPlusCircle = faPlusCircle;
  faListAlt = faListAlt;
  faMoneyCheckAlt = faMoneyCheckAlt;
  faPiggyBank = faPiggyBank;

  userType: string;

  constructor(public authService: AuthService) {
    this.userType = this.authService.getUserType();
  }

  ngOnInit() {}

  logOut() {
    this.authService.logout();
  }
}
