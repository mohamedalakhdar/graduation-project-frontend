pipeline {
    agent {
        label 'jenkins-agent'
    }

    tools {
        jdk 'java22'
        nodejs 'nodejs22'
    }

    environment {
        SCANNER_HOME = tool 'sonarqube-scanner'
    }

    stages {
        stage('clean workspace') {
            steps {
                cleanWs()
            }
        }

        stage('checkout from git') {
            steps {
                git branch: 'master', url: 'https://github.com/mohamedalakhdar/graduation-project-frontend.git' ,  credentialsId: 'github-credential'
            }
        }

        stage('sonarqube analysis') {
            steps {
                withSonarQubeEnv('sonarqube-server') {
                    sh """
                        ${SCANNER_HOME}/bin/sonar-scanner \
                        -Dsonar.projectKey=sonar-project \
                        -Dsonar.projectName=sonar-project \
                        -Dsonar.sources=.
                    """
                }
            }
        }

        stage('quality gate') {
            steps {
                script {
                    waitForQualityGate abortPipeline: false, credentialsId: 'sonarqube-credential'
                }
            }
        }

        stage('install dependences') {
            steps {
                sh 'npm install'
            }
        }

        stage('trivy fs scan') {
            steps {
                sh 'trivy fs . > trivyfs.txt'
            }
        }

        stage('docker build&push') {
            steps {
                withDockerRegistry(url: 'https://index.docker.io/v1/', credentialsId: 'docker-credential') {
                    sh 'docker build -t frontend-image .'
                    sh 'docker tag frontend-image mohamedahmedalakhdar/frontend-image'
                    sh 'docker push mohamedahmedalakhdar/frontend-image'
                }
            }
        }    
        stage('trivy'){
            steps {
                sh 'trivy image mohamedahmedalakhdar/frontend-image > trivyimage.txt'
            }
        }    

        

    }
}