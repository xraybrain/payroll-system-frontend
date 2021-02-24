export class Feedback<T> {
  isLoggedIn: boolean;    
  constructor(
    public result: T,
    public success: boolean,
    public message: string,
    public totalItems = 0,
    public totalPages = 0,
    public currentPage = 0
  ) {}
}
