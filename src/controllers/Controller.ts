import { Request, Response } from 'express';

export interface Controller {
  route: string;
  method: HttpMethods;
  handle: (
    request: Request,
    response: Response
  ) => Promise<Response> | Response;
}

export enum HttpMethods {
  GET = 'get',
  POST = 'post',
}
