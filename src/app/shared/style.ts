export const getPx = (value): number => {
  return value && +value.replace('px', '');
};

export const getScale = (value): { value: number; pattern: string } => {
  const match = value.match(/scale\((.*?)\)/);
  if (match) {
    const [pattern, scale] = match;
    return { value: +scale, pattern };
  }
};

export const getTranslate = (value): { x: number; y: number; pattern: string } => {
  const match = value.match(/translate\((.*?)px,\s(.*?)px\)/);
  if (match) {
    const [pattern, x, y] = match;
    return { x: +x, y: +y, pattern };
  }
};

