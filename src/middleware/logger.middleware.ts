import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { format } from 'date-fns';
import { Request, Response } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new Logger(`HTTP`);
  use(req: Request, res: Response, next: () => void) {
    const start = performance.now();

    res.on('finish', () => {
      const end = performance.now();
      const responseTime = end - start;
      this.logger.log(
        `${req.method} ${req.originalUrl} - ${
          res.statusCode
        } - ${responseTime.toFixed(2)} ms`,
      );
    });

    next();
  }
}
