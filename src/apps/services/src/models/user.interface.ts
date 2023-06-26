export default interface IUser {
  userId: number;
  email: string;
  password: string;
  userRole: number;
  dateCreated: Date;
  lastLoggedIn: Date;
}
