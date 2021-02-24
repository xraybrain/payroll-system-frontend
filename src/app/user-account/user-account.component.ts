// import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
// import { faSpinner } from "@fortawesome/free-solid-svg-icons";
// import { Inventory } from "../models/inventory";
// import { User } from "../models/user.model";
// import { NotificationService } from "../services/notification.service";
// import { UserService } from "../services/user.service";

// @Component({
//   selector: "app-user-account",
//   templateUrl: "./user-account.component.html",
//   styleUrls: ["./user-account.component.css"],
// })
// export class UserAccountComponent implements OnInit {
//   faSpinner = faSpinner;

//   @Input()
//   isNewItemMode: boolean;
//   @Input()
//   isEditMode: boolean;
//   @Input()
//   userProfile: User;

//   @Output()
//   newUser: EventEmitter<User> = new EventEmitter();

//   @Output()
//   userUpdate: EventEmitter<User> = new EventEmitter();

//   formErrors: any = {
//     userType: null,
//     surname: null,
//     othernames: null,
//     gender: null,
//     email: null,
//     password: null,
//   };
//   isProcessing = false;

//   constructor(
//     public userService: UserService,
//     public notify: NotificationService
//   ) {}

//   saveData() {
//     if (this.isProcessing) return;
//     this.isProcessing = true;
//     this.userService.saveUser(this.userProfile).subscribe(
//       (response) => {
//         this.isProcessing = false;
//         if (response.success) {
//           this.newUser.emit(response.result);
//           this.userProfile = new User(
//             null,
//             null,
//             null,
//             null,
//             null,
//             new Inventory(null),
//             null
//           );
//           this.notify.showSuccess(response.message, "Success");
//         } else {
//           this.notify.showWarning(response.message, "Operation failed");
//           console.log(response);
//           this.formErrors = response.result || {
//             userType: null,
//             surname: null,
//             othernames: null,
//             gender: null,
//             email: null,
//             password: null,
//           };
//         }
//       },
//       (reason) => {
//         console.log(reason);
//         this.notify.showError(
//           "We encountered error while contacting server.",
//           "Operation failed"
//         );
//       }
//     );
//   }

//   updateData() {
//     if (this.isProcessing) return;
//     this.isProcessing = true;
//     this.userService.updateUser(this.userProfile).subscribe(
//       (response) => {
//         if (response.success) {
//           this.notify.showSuccess(response.message, "success");
//           this.userUpdate.emit(response.result);
//         } else {
//           this.notify.showError(response.message, "Operation failed");
//         }
//       },
//       (reason) => {
//         console.log(reason);
//         this.notify.showError("Unable to contact server.", "Operation failed");
//       },
//       () => {
//         this.isProcessing = false;
//       }
//     );
//   }

//   ngOnInit() {}
// }
