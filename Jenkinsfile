pipeline {
  agent any

  environment {
    // This makes Docker build into Minikube's Docker daemon
    MINIKUBE_ENV = "eval \$(minikube docker-env)"
    IMAGE_NAME = "backend-image"
    K8S_MANIFESTS_DIR = "k8s/"
  }

  stages {
    stage('Checkout') {
      steps {
        git url: 'https://github.com/YOUR_USERNAME/YOUR_REPO.git', branch: 'main'
      }
    }

    stage('Connect to Minikube Docker') {
      steps {
        sh '''
          echo "Setting Docker env to Minikube"
          ${MINIKUBE_ENV}
          docker info
        '''
      }
    }

    stage('Build Docker Image') {
      steps {
        sh '''
          echo "Building Docker image..."
          ${MINIKUBE_ENV}
          docker build -t ${IMAGE_NAME} ./server
        '''
      }
    }

    stage('Deploy to Kubernetes') {
      steps {
        sh '''
          echo "Applying Kubernetes manifests..."
          kubectl apply -f ${K8S_MANIFESTS_DIR} --recursive
        '''
      }
    }

    stage('Rollout Restart Backend') {
      steps {
        sh '''
          echo "Restarting backend deployment..."
          kubectl rollout restart deployment/backend-deployment
        '''
      }
    }
  }

  post {
    success {
      echo '✅ Deployment succeeded.'
    }
    failure {
      echo '❌ Deployment failed.'
    }
  }
}
