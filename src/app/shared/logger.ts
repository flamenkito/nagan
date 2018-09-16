function consoleColor(style: string, location: string) {
  return (message: string, info?: any) => {
    const args = [`%c ${location}: ${message} `, style];
    if (info) {
      args.push(info);
    }
    console.log(...args);
  };
}

export function Logger(location: string) {
  return {
    success: consoleColor(
      'background: green; color: white; display: block;',
      location
    ),
    warning: consoleColor(
      'background: darkorange; color: white; display: block;',
      location
    ),
    danger: consoleColor(
      'background: firebrick; color: white; display: block;',
      location
    ),
    info: consoleColor(
      'background: cadetblue; color: white; display: block;',
      location
    )
  };
}
