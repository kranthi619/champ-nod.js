pipeline {
    agent any
    
    environment {
        ECR_REPOSITORY_NAME = 'champ-poc1'
        ECR_REPOSITORY = '996034040698.dkr.ecr.ap-south-1.amazonaws.com/champ-poc1'
        REGION = 'ap-south-1'
        ECS_CLUSTER = 'ecs-fargate-poc'
        ECS_SERVICE = 'ecs-fargate-svc'
        ACCOUNT_NO = '996034040698'
        JOB_NAME = 'champ-poc'
        WORKSPACE = '/var/lib/jenkins/jobs/champ-poc'
        ECS_TIMEOUT = '600'
        BUILD_ID = "${env.BUILD_ID}"
        Task_defination = "task-definition.json"
    }
    
    stages {
        stage('Clone Git Repo') {
            steps {
                checkout([
                    $class: 'GitSCM',
                    branches: [[name: "master"]],
                    userRemoteConfigs: [[url: 'https://github.com/champ2024/nod.js.git', credentialsId: 'githubcred1']]
                ])
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
                    aws ecr get-login-password --region $REGION | docker login --username AWS --password-stdin $ACCOUNT_NO.dkr.ecr.$REGION.amazonaws.com
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
        
        stage('Remove image from jenkins server') {
            steps {
                script {
                    sh "docker rmi $ECR_REPOSITORY:latest_$BUILD_ID"
                }
            }
        }
        
        stage('Update Task Definition and Get ecs-deploy') {
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
}
