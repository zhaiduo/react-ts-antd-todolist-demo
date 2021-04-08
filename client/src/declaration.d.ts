declare module '*.less';

declare module 'querystring' {
  export function stringify(val: object): string
  export function parse(val: string): object
}

declare module "reqwest";
declare module "react-infinite-scroller";
