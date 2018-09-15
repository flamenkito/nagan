export class Logger {
  constructor(private readonly location: string) {}

  consoleColor(style: string, message: string, info?: string) {
    const args = [`%c ${this.location}: ${message} `, style];
    if (info) {
      args.push(info);
    }
    console.log(...args);
  }

  success(message: string, info?: string) {
    this.consoleColor(
      'background: green; color: white; display: block;',
      message,
      info
    );
  }

  warning(message: string, info?: string) {
    this.consoleColor(
      'background: darkorange; color: white; display: block;',
      message,
      info
    );
  }

  danger(message: string, info?: string) {
    this.consoleColor(
      'background: firebrick; color: white; display: block;',
      message,
      info
    );
  }
}
