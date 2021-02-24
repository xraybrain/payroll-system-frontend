import { Component, OnInit } from "@angular/core";
import {
  faBell,
  faChartLine,
  faHistory,
  faList,
  faListAlt,
  faMoneyBill,
  faPepperHot,
  faPiggyBank,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { NotificationService } from "src/app/services/notification.service";
import { StaffService } from "src/app/services/staff.service";
import { Chart } from "chart.js";
import { Bank } from "src/app/models/bank.models";

@Component({
  selector: "app-admin-dashboard",
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  faChartLine = faChartLine;
  faUsers = faUsers;
  faMoneyBill = faMoneyBill;
  faHistory = faHistory;
  faUser = faUser;
  faBell = faBell;
  faPepperHot = faPepperHot;
  faListAlt = faListAlt;
  faPiggyBank = faPiggyBank;

  // restocks: Product[] = [];
  // restockHistory: Restock[] = [];
  hasMoreRestocks = false;
  currrentRestockPage = 1;
  isLoadingRestocks = false;

  days = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  summary = {
    totalStaff: null,
    totalBanks: null,
    totalDepts: null,
    monthlySalaries: null,
    annualPayroll: [],
    bankSchedule: [],
  };

  chartConfig = {
    label: "Chart",
    fill: false,
    lineTension: 0.1,
    backgroundColor: "rgba(75,192,192,0.4)",
    borderColor: "rgba(75,192,192,1)",
    borderCapStyle: "butt",
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: "miter",
    pointBorderColor: "rgba(75,192,192,1)",
    pointBackgroundColor: "#fff",
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: "rgba(75,192,192,1)",
    pointHoverBorderColor: "rgba(220,220,220,1)",
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    data: [],
  };

  annualLineChartData: Chart.ChartDataSets[] = [
    JSON.parse(JSON.stringify(this.chartConfig)),
  ];
  scheduleLineChartData: Chart.ChartDataSets[] = [
    JSON.parse(JSON.stringify(this.chartConfig)),
  ];

  annualLineChartLabels: Array<any> = [];
  scheduleLineChartLabels: Array<any> = [];
  lineChartOptions: any = {
    responsive: true,
  };

  lineChartLegend = true;
  lineChartType = "bar";
  inlinePlugin: any;
  textPlugin: any;

  months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  constructor(
    public notify: NotificationService,
    public staffService: StaffService
  ) {}

  // generateAnnualChartData(
  //   payrolls: { createdAt: string; totalNetPay: number }[]
  // ) {
  //   for (let payroll of payrolls) {
  //     this.annualLineChartData[0].data.push(Number(payroll.totalNetPay));
  //   }
  // }

  generateAnnualChartData(
    payrolls: { createdAt: string; totalNetPay: number }[]
  ) {
    this.annualLineChartData[0].label = `${new Date().getFullYear()} - Annual Payroll Chart`;
    for (let payroll of payrolls) {
      let d = new Date(payroll["createdAt"]);
      this.annualLineChartData[0].data.push(Number(payroll.totalNetPay));
      let label = `${this.months[d.getMonth()]}`;
      if (!this.annualLineChartLabels.includes(label)) {
        this.annualLineChartLabels.push(label);
      } else {
        this.annualLineChartLabels.push("...");
      }
    }
  }

  generateScheduleChartData(schedules: { Bank: Bank; totalNetPay: number }[]) {
    this.scheduleLineChartData[0].label = `Last Payroll Bank Schedule`;
    for (let schedule of schedules) {
      this.scheduleLineChartData[0].data.push(Number(schedule.totalNetPay));
      let label = `${schedule.Bank["name"]}`;
      if (!this.scheduleLineChartLabels.includes(label)) {
        this.scheduleLineChartLabels.push(label);
      } else {
        this.scheduleLineChartLabels.push("...");
      }
    }
  }

  ngOnInit() {
    this.staffService.getDashboardSummary().subscribe((response) => {
      console.log(response);
      if (response.success) {
        this.summary = response.result;
        this.generateAnnualChartData(this.summary.annualPayroll);
        this.generateScheduleChartData(this.summary.bankSchedule);
      }
    });

    this.textPlugin = [
      {
        id: "textPlugin",
        beforeDraw(chart: any): any {
          const width = chart.chart.width;
          const height = chart.chart.height;
          const ctx = chart.chart.ctx;
          ctx.restore();
          const fontSize = (height / 114).toFixed(2);
          ctx.font = `${fontSize}em sans-serif`;
          ctx.textBaseline = "middle";
          const text = "Text Plugin";
          const textX = Math.round((width - ctx.measureText(text).width) / 2);
          const textY = height / 2;
          ctx.fillText(text, textX, textY);
          ctx.save();
        },
      },
    ];

    // this.inlinePlugin = this.textPlugin;
  }
}
