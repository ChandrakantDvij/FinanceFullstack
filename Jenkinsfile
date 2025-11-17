pipeline {
    agent any

    environment {
        GIT_CREDENTIALS = 'github-clone-token'
        REPO_URL = 'https://github.com/Vaishnavi052/Finance-Application.git'
        APP_DIR = "${WORKSPACE}"
        BACKEND_URL = 'http://192.168.29.224:5000/health'
    }

    stages {
        stage('Checkout Latest Code') {
            steps {
                script {
                    echo "\u001B[36mCloning latest code...\u001B[0m"
                    dir("${APP_DIR}") {
                        checkout([
                            $class: 'GitSCM',
                            branches: [[name: 'main']],
                            userRemoteConfigs: [[
                                credentialsId: "${GIT_CREDENTIALS}",
                                url: "${REPO_URL}"
                            ]]
                        ])
                    }
                }
            }
        }

        stage('Stop Old Containers') {
            steps {
                script {
                    dir("${APP_DIR}") {
                        echo "\u001B[33mStopping old containers if any...\u001B[0m"
                        sh 'docker compose down || true'
                    }
                }
            }
        }

        stage('Build and Start Containers') {
            steps {
                script {
                    dir("${APP_DIR}") {
                        echo "\u001B[36mBuilding and starting containers...\u001B[0m"
                        sh 'docker compose up -d --build'
                    }
                }
            }
        }

        stage('Stream Backend Logs & Wait API') {
            steps {
                script {
                    echo "\u001B[36mStreaming backend logs and waiting for API...\u001B[0m"
                    retry(12) {
                        sh "docker logs -f finance-backend --tail 20 &"
                        sleep 5
                        def result = sh(
                            script: "curl -f ${BACKEND_URL} >/dev/null 2>&1 && echo success || echo fail",
                            returnStdout: true
                        ).trim()
                        if (result != 'success') {
                            echo "\u001B[33mBackend API not ready yet, retrying...\u001B[0m"
                            error("Retrying...")
                        } else {
                            echo "\u001B[32m✅ Backend API is responding!\u001B[0m"
                        }
                    }
                }
            }
        }

        stage('Show Last Logs') {
            steps {
                script {
                    echo "\u001B[36mDisplaying last 50 lines of all container logs...\u001B[0m"
                    sh 'docker compose logs --tail 50'
                }
            }
        }
    }

    post {
        success {
            echo "\u001B[32m Finance Application deployed successfully!\u001B[0m"
        }
        failure {
            echo "\u001B[31m Deployment failed. Check docker logs above for errors.\u001B[0m"
        }
    }
}

