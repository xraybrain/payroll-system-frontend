// import { Component, OnInit } from "@angular/core";
// import { Router } from "@angular/router";
// import {
//   faCheckCircle,
//   faChevronCircleLeft,
//   faChevronCircleRight,
//   faHome,
//   faSignInAlt,
//   faSpinner,
//   faUserPlus,
// } from "@fortawesome/free-solid-svg-icons";
// import { NotificationService } from "../services/notification.service";
// import { ReporterService } from "../services/reporter.service";
// import { Reporter } from "../models/Reporter";
// import { Citizen } from "../models/Citizen";

// @Component({
//   selector: "app-register",
//   templateUrl: "./register.component.html",
//   styleUrls: ["./register.component.css"],
// })
// export class RegisterComponent implements OnInit {
//   faHome = faHome;
//   faUserPlus = faUserPlus;
//   faSpinner = faSpinner;
//   faChevronCircleRight = faChevronCircleRight;
//   faChevronCircleLeft = faChevronCircleLeft;
//   faCheckCircle = faCheckCircle;
//   faSignInAlt = faSignInAlt;

//   userProfile = new Reporter(
//     null,
//     null,
//     null,
//     null,
//     new Citizen(null, null, null, null, null, null, null, null, null, null)
//   );

//   isProcessing = false;

//   showMainView: boolean;
//   showUserBioView: boolean;

//   formErrors: any = {};

//   constructor(
//     public reporterService: ReporterService,
//     public notify: NotificationService,
//     public router: Router
//   ) {}

//   ngOnInit() {}

//   register() {
//     if (this.isProcessing) return;
//     this.isProcessing = true;

//     this.reporterService.saveReporter(this.userProfile).subscribe(
//       (response) => {
//         if (response.success) {
//           this.notify.showSuccess("Account created successfully", "Success");
//           this.router.navigate(["/login"]);
//         } else {
//           console.log(response);
//           this.formErrors = response.result || {};
//           this.notify.showWarning(response.message, "Operation failed");
//         }
//       },
//       (reason) => {
//         console.log(reason);
//         this.notify.showWarning(
//           "we encountered a problem while contacting server",
//           "Operation failed"
//         );
//       },
//       () => {
//         this.isProcessing = false;
//       }
//     );
//   }
// }
