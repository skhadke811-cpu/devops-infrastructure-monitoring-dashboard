pipeline {
  agent any

  options {
    timestamps()
    disableConcurrentBuilds()
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Deploy to Ubuntu') {
      steps {
        sh 'sudo /usr/local/bin/deploy-monitoring-dashboard "$WORKSPACE"'
      }
    }
  }

  post {
    success {
      echo 'Dashboard deployment completed successfully.'
    }
    failure {
      echo 'Pipeline failed. Check the stage logs.'
    }
  }
}
