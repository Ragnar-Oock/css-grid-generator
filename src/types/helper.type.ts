
export type OneOrMore<T> = [T, ...T[]];


export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
