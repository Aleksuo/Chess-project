import * as grpcWeb from 'grpc-web';

import * as test_service_test_service_pb from '../test_service/test_service_pb'; // proto import: "test_service/test_service.proto"


export class TestServiceClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  hello(
    request: test_service_test_service_pb.HelloRequest,
    metadata: grpcWeb.Metadata | undefined,
    callback: (err: grpcWeb.RpcError,
               response: test_service_test_service_pb.HelloReply) => void
  ): grpcWeb.ClientReadableStream<test_service_test_service_pb.HelloReply>;

}

export class TestServicePromiseClient {
  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; });

  hello(
    request: test_service_test_service_pb.HelloRequest,
    metadata?: grpcWeb.Metadata
  ): Promise<test_service_test_service_pb.HelloReply>;

}

