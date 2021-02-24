export class ImageSnippet {
  pending: boolean = false;
  status: string = "init";
  bytesPerKilo: number = 1024;
  fileSize: number;
  maxFileSize: number = 200;
  minFileSize: number = 5;
  hasSizeError: boolean;

  constructor(public src: any, public file?: File) {
    this.fileSize = Math.ceil(this.file.size / this.bytesPerKilo);
    this.hasSizeError =
      this.fileSize > this.maxFileSize || this.fileSize < this.minFileSize;
  }
}
