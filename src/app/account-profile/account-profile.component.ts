// import { Component, Input, OnInit } from "@angular/core";
// import { faSpinner, faUser } from "@fortawesome/free-solid-svg-icons";
// import { User } from "../models/user.model";
// import { NotificationService } from "../services/notification.service";
// import { UserService } from "../services/user.service";

// @Component({
//   selector: "app-account-profile",
//   templateUrl: "./account-profile.component.html",
//   styleUrls: ["./account-profile.component.css"],
// })
// export class AccountProfileComponent implements OnInit {
//   faUser = faUser;
//   faSpinner = faSpinner;
//   isProcessing = false;

//   @Input()
//   userProfile: any = {
//     userId: null,
//     gender: null,
//     regNo: null,
//     User: new User(null, null, null, null),
//   };
//   constructor(
//     public userService: UserService,
//     public notify: NotificationService
//   ) {}

//   ngOnInit() {}

//   onUpdate() {
//     if (this.isProcessing) return;
//     this.isProcessing = true;
//     this.userService.updateUser(this.userProfile).subscribe(
//       (response) => {
//         if (response.success) {
//           this.notify.showSuccess("Account updated successfully", "Success");
//         } else {
//           this.notify.showSuccess(response.message, "Operation failed");
//         }
//       },
//       (reason) => {
//         console.log(reason);
//         this.notify.showSuccess("Failed to updated", "Update Failed");
//       },
//       () => {
//         this.isProcessing = false;
//       }
//     );
//   }
// }
