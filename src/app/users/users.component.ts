// import { Component, OnInit, Output, EventEmitter, Input } from "@angular/core";
// import { Router } from "@angular/router";
// import {
//   faCog,
//   faEdit,
//   faEllipsisH,
//   faSearch,
//   faSpinner,
//   faTimes,
//   faTrash,
//   faUser,
//   faUsers,
// } from "@fortawesome/free-solid-svg-icons";
// import { MessageboxResponse, ViewModes } from "../models/app-enums";
// import { Inventory } from "../models/inventory";
// import { User } from "../models/user.model";
// import { MessageboxService } from "../services/messagebox.service";
// import { NotificationService } from "../services/notification.service";
// import { ProfilePopupService } from "../services/profile-popup.service";
// import { UserService } from "../services/user.service";

// @Component({
//   selector: "app-users",
//   templateUrl: "./users.component.html",
//   styleUrls: ["./users.component.css"],
// })
// export class UsersComponent implements OnInit {
//   faSearch = faSearch;
//   faUsers = faUsers;
//   faUser = faUser;
//   faEdit = faEdit;
//   faTrash = faTrash;
//   faSpinner = faSpinner;
//   faTimes = faTimes;
//   faCog = faCog;
//   faEllipsisH = faEllipsisH;

//   users: User[] = [];
//   isLoading = false;
//   searchquery = "";
//   hasMoreData = false;
//   currentPage = 1;

//   @Input()
//   isMainMode = false;
//   @Input()
//   isEditMode = false;
//   @Input()
//   isNewItemMode = false;

//   @Output()
//   changeViewMode: EventEmitter<ViewModes> = new EventEmitter();

//   userProfile: User = new User(
//     null,
//     null,
//     null,
//     null,
//     null,
//     new Inventory(null),
//     null
//   );

//   constructor(
//     public userService: UserService,
//     public notify: NotificationService,
//     public messageBox: MessageboxService,
//     public profilePopup: ProfilePopupService,
//     public router: Router
//   ) {}

//   ngOnInit() {
//     this.loadData();
//   }

//   loadData(page = 1) {
//     if (this.isLoading) return;
//     this.isLoading = true;

//     this.userService.getUsers(page, this.searchquery).subscribe(
//       (response) => {
//         if (response.result) {
//           this.users = this.users.concat(response.result);
//           this.hasMoreData = response.totalPages > response.currentPage;
//           this.currentPage = Number(response.currentPage);
//         } else {
//           // notify
//           this.notify.showWarning(response.message, "Loading Failed");
//           if (!response.isLoggedIn) {
//             this.router.navigate(["/login"]);
//           }
//         }
//       },
//       (reason) => {
//         this.notify.showError(
//           "we encountered a problem while contacting server",
//           "Operation failed"
//         );
//       },
//       () => {
//         this.isLoading = false;
//       }
//     );
//   }

//   onSearch() {
//     this.users = [];
//     this.loadData();
//   }

//   onViewProfile(user: User) {
//     let modalInstance = this.profilePopup.show(user);
//     modalInstance.result.then(() => {}).catch(() => {});
//   }

//   onBackToMain() {
//     this.changeViewMode.emit(ViewModes.MainView);
//     this.resetData();
//   }
  
//   onEdit(user: User) {
//     this.changeViewMode.emit(ViewModes.EditView);
//     user.password = undefined;
//     this.userProfile = Object.assign({}, user);
//   }

//   onNewUser(user: User) {
//     this.users.push(user);
//   }

//   onUserUpdate(user: User) {
//     let index = this.users.findIndex((d) => d.id === user.id);
//     if (index > -1) {
//       this.users.splice(index, 1);
//       this.users.push(user);
//     }
//   }

//   onDelete(user: User) {
//     let modalInstance = this.messageBox.showWarning(
//       `Are you sure you want to delete ${user.surname} ${user.othernames}?`,
//       "Delete Warning"
//     );
//     modalInstance.result
//       .then((response: MessageboxResponse) => {
//         if (response === MessageboxResponse.OK) {
//           let tid = this.notify.showProcessing("Deleting user");
//           this.userService.deleteUser(user).subscribe(
//             (response) => {
//               if (response.success) {
//                 let index = this.users.findIndex((d) => d.id === user.id);
//                 if (index > -1) this.users.splice(index, 1);
//                 this.notify.showSuccess(response.message, "Success");
//               } else {
//                 this.notify.showWarning(response.message, "Operation failed");
//               }
//             },
//             (reason) => {
//               this.notify.showError(
//                 "we were unable to contact server.",
//                 "Operation failed"
//               );
//             },
//             () => {
//               this.notify.hideProcessing(tid);
//             }
//           );
//         }
//       })
//       .catch((reason) => {});
//   }

//   resetData() {
//     this.userProfile = new User(
//       null,
//       null,
//       null,
//       null,
//       null,
//       new Inventory(null),
//       null
//     );
//   }
// }
