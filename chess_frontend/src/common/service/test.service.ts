import { Injectable } from '@angular/core';
import { TestServiceClientImpl, HelloReply, HelloRequest } from '@grpc-types/test_service/test_service'

@Injectable({
  providedIn: 'root'
})
export class TestService {

  constructor() { }

  test(request: HelloRequest): HelloReply {

  }
    

}
