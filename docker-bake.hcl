variable "TAG" {
    default = "latest"
}

group "default" {
    targets = ["backend"]
}


target "backend" {
    dockerfile = "Dockerfile"
    context = "backend"
    tags = ["dev-registry.localhost:5000/backend:${TAG}"]
}
