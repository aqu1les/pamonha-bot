import { Request, Response } from 'express';
import { Controller, HttpMethods } from './Controller';

export class IndexController implements Controller {
  route = '/';
  method = HttpMethods.GET;

  async handle(req: Request, res: Response): Promise<Response> {
    return res.send('to funfando mano');
  }
}
