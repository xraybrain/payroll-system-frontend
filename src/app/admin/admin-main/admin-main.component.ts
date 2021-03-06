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
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { AuthService } from "src/app/services/auth.service";
import { ResetPasswordModalService } from "src/app/services/reset-password-modal.service";

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
  faCog = faCog;

  userType: string;

  constructor(
    public authService: AuthService,
    public resetPasswordModal: ResetPasswordModalService
  ) {
    this.userType = this.authService.getUserType();
  }

  ngOnInit() {}

  logOut() {
    this.authService.logout();
  }

  resetPassword() {
    this.resetPasswordModal.show();
  }
}
