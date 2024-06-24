import { Injectable } from '@angular/core';
import { TestServiceClient } from '@grpc-types/test_service/Test_serviceServiceClientPb';
import { HelloReply, HelloRequest } from '@grpc-types/test_service/test_service_pb';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  // TODO: do this properly
  client = new TestServiceClient('http://localhost:8080', null, null);

  constructor() { }

  sendHelloMessage(message: string): Promise<HelloReply> {
    const helloRequest = new HelloRequest();
    helloRequest.setName(message);
    return this.client.hello(helloRequest);
  }
    

}
