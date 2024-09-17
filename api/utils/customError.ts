// export interface CustomError {
//   status: number;
//   message: string;
// }

// export const customError = (status: number, message: string): CustomError => ({
//   status,
//   message,
// });

export class CustomError extends Error {
  public status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'CustomError';
  }
}
