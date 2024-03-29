pipeline {
    agent any
    parameters {
        gitParameter branchFilter: 'origin/(.*)', name: 'BRANCH', type: 'PT_BRANCH'
    }
    environment {
        ECR_REPOSITORY_NAME = 'kranthi-repo'
        ECR_REPOSITORY = '996034040698.dkr.ecr.ap-south-1.amazonaws.com/kranthi-repo'
        REGION = 'ap-south-1'
        ECS_CLUSTER = 'ecs-far'
        ECS_SERVICE = 'ecs-far-srvc'
        ACCOUNT_NO = '996034040698'
        JOB_NAME = 'ecs-far-champ'
        WORKSPACE = '/var/lib/jenkins/jobs/ecs-far-champ'
        ECS_TIMEOUT = '600'
    }
    stages {
        stage('Clone Git Repo') {
            steps {
                script {
                    checkout([
                        $class: 'GitSCM',
                        branches: [[name: "main"]],
                        userRemoteConfigs: [[url: 'https://github.com/champ2024/nod.js.git', credentialsId: 'githubcred']]
                    ])
                }
            }
        }
        stage('Docker build') {
            steps {
                script {
                    sh '''
                      docker build -t $ACCOUNT_NO.dkr.ecr.$REGION.amazonaws.com/$ECR_REPOSITORY_NAME:latest_$BUILD_ID .
                    '''
                }
            }
        }
        stage('ECR Login') {
            steps {
                script {
                    sh '''
                      aws ecr get-login-password --region ap-south-1 | docker login --username AWS --password-stdin 996034040698.dkr.ecr.ap-south-1.amazonaws.com
                    '''
                }
            }
        }
        stage('Docker push') {
            steps {
                script {
                    sh "docker push $ECR_REPOSITORY:latest_$BUILD_ID"
                }
            }
        }
        stage('Remove image from Jenkins server') {
            steps {
                script {
                    sh "docker rmi $ECR_REPOSITORY:latest_$BUILD_ID"
                }
            }
        }
        stage('Update and Get ecs-deploy') {
            steps {
                script {
                    sh  '''#!/bin/bash
                       sed -i 's+latest+latest_'$BUILD_ID'+g' $Task_defination
                       wget https://raw.githubusercontent.com/silinternational/ecs-deploy/master/ecs-deploy
                       chmod u+x ecs-deploy
                    '''
                }
            }
        }
        stage('Deploying image to ECS Cluster') {
            steps {
                script {
                    sh  '''#!/bin/bash
                        ./ecs-deploy -c $ECS_CLUSTER \
                                     -n $ECS_SERVICE \
                                     -r $REGION \
                                     -i $ECR_REPOSITORY:latest_$BUILD_ID \
                                     -t $ECS_TIMEOUT \
                                     --use-latest-task-def
                    '''
                }
            }
        }
    }
    post {
        success {
            script {
                if (params.BRANCH == 'qa') {
                    build job: 'ecs-far', parameters: [string(name: 'BRANCH', value: 'main')]
                }
            }
        }
    }
}
