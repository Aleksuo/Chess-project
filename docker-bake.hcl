variable "TAG" {
    default = "latest"
}

group "default" {
    targets = ["backend", "frontend"]
}


target "backend" {
    dockerfile = "Dockerfile"
    context = "backend"
    tags = ["dev-registry.localhost:5000/backend:${TAG}"]
}


target "frontend" {
  dockerfile = "Dockerfile"
  context = "frontend"
  tags = ["dev-registry.localhost:5000/frontend:${TAG}"]
  target = "production"
}
