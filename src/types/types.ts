/* eslint-disable @typescript-eslint/no-explicit-any */

export interface PublicRouter {
  path: string;
  component: any;
  layout?: any;
}

export interface ResAPI<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface VpcsLink {
  _id: string;
  slug: string;
  domain: string;
  currentChild: number;
  timeOut: number;
  social: string;
  isActive: boolean;
  visitAmount: number;
  variantUrl: string;
  children: VpcsLinkChild[];
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface VpcsLinkChild {
  _id: string;
  url: string;
  isActive: boolean;
  visitAmount: number;
  vpcsLinkId: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
