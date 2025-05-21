# Set default image names
BACKEND_IMAGE=backend-image
EMAIL_WORKER_IMAGE=email-worker-image

# Start Minikube with enough resources
start-minikube:
	minikube start 

# Use Minikube Docker daemon
use-minikube-docker:
	eval $$(minikube docker-env)

# Build Docker images
build:
	eval $$(minikube docker-env) && docker build -t $(BACKEND_IMAGE) ./server
	eval $$(minikube docker-env) && docker build -t $(EMAIL_WORKER_IMAGE) ./email-worker

# Deploy Kubernetes manifests
deploy:
	kubectl apply -f k8s/ --recursive

#Wait until backend pod is ready
wait-backend:
	kubectl wait --for=condition=ready pod -l app=backend --timeout=120s

# Port-forward backend API
port-forward:
	kubectl port-forward service/backend-service 5000:5000

# Cleanup everything
cleanup:
	kubectl delete -f k8s/ --recursive
	minikube stop

# Shortcut for full setup
up:
	make start-minikube
	make build
	make deploy
	make wait-backend
	make port-forward

# Shortcut for full teardown
down: cleanup
