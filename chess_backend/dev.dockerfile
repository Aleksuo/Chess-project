FROM golang:1.22.3-alpine
RUN apk add --update nodejs npm
RUN apk update && apk add --no-cache make protobuf-dev
RUN go install google.golang.org/protobuf/cmd/protoc-gen-go@v1.28 
RUN go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@v1.2
ENV PATH="$PATH:$(go env GOPATH)/bin"