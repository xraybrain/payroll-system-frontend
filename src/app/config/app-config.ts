export class AppConfig {
  static print(target: string) {
    let body = $(target).html();
    if (!body) return console.log("nothing to print");
    var win = window.open(
      "",
      "_blank",
      "left=0, top=0, titlebar=0, width=500, height=500",
      true
    );

    var title = `<head>
    <title>Payroll System</title>
      <style type="text/css">
        table{
          width: 100%;
          border-collapse: collapse;
          margin: 5px;
        }
        table,th,td {
          border: 1px solid #000;
        }
        th{
          text-align: left;
        }
      </style>
    </head>`;
    body = title + body;
    win.document.write(body);
    win.print();
  }
}
