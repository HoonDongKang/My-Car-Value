import {
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UseInterceptors,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { plainToClass } from 'class-transformer';

//it means class type
interface ClassCosntructor {
  new (...args: any[]): object;
}

// custom decorator
export function Serialize(dto: ClassCosntructor) {
  return UseInterceptors(new SerializerInterceptor(dto));
}

// response 하기 전에 entity json을 받아서 dto를 통해 조작 가능 (interceptor)
export class SerializerInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Run something before a request is handled
    // by the request handler

    return next.handle().pipe(
      map((data: any) => {
        // Run Something before the response is sent out
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
