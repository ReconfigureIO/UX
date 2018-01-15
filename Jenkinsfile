notifyStarted()

BASE_URL = "/${env.BRANCH_NAME}/"

node ('master') {
    try {
        timeout(time: 10, unit: 'MINUTES') {
            stage 'checkout'
            checkout scm

            stage 'lint'
            sh 'docker build -t "reconfigureio/sphinx:latest" docs'
            sh 'docker build -t "reconfigureio/dashboard:latest" dashboard'

            stage 'build'
            if(env.BRANCH_NAME == "master") {
                sh 'docker run -v $PWD/docs:/mnt --env-file=docs/vars/production.env "reconfigureio/sphinx:latest" make html'
                sh 'docker run -v $PWD/dashboard:/mnt /"reconfigureio/dashboard:latest" make production'
            }else{
                sh 'docker run -v $PWD/docs:/mnt --env-file=docs/vars/staging.env "reconfigureio/sphinx:latest" make html' 
                sh 'docker run -v $PWD/dashboard:/mnt "reconfigureio/dashboard:latest" make build'
            }

            stage 'upload'

            if(env.BRANCH_NAME == "master") {
                step([$class: 'S3BucketPublisher', dontWaitForConcurrentBuildCompletion: false, entries: [[bucket: "docs.reconfigure.io/ux/production/dashboard", excludedFile: '', flatten: false, gzipFiles: false, keepForever: true, managedArtifacts: false, noUploadOnFailure: true, selectedRegion: 'us-east-1', showDirectlyInBrowser: false, sourceFile: 'dashbaored/dist/**/*', storageClass: 'STANDARD', uploadFromSlave: true, useServerSideEncryption: false]], profileName: 's3', userMetadata: []])
                step([$class: 'S3BucketPublisher', dontWaitForConcurrentBuildCompletion: false, entries: [[bucket: "docs.reconfigureio-infra.com/ux/production/docs", excludedFile: '', flatten: false, gzipFiles: false, keepForever: true, managedArtifacts: false, noUploadOnFailure: true, selectedRegion: 'us-east-1', showDirectlyInBrowser: false, sourceFile: 'docs/build/html/**/*', storageClass: 'STANDARD', uploadFromSlave: true, useServerSideEncryption: false]], profileName: 's3', userMetadata: []])
            }else{
                step([$class: 'S3BucketPublisher', dontWaitForConcurrentBuildCompletion: false, entries: [[bucket: "docs.reconfigure.io/ux/${env.BRANCH_NAME}/dashboard", excludedFile: '', flatten: false, gzipFiles: false, keepForever: true, managedArtifacts: false, noUploadOnFailure: true, selectedRegion: 'us-east-1', showDirectlyInBrowser: false, sourceFile: 'dashboard/dist/**/*', storageClass: 'STANDARD', uploadFromSlave: true, useServerSideEncryption: false]], profileName: 's3', userMetadata: []])
                step([$class: 'S3BucketPublisher', dontWaitForConcurrentBuildCompletion: false, entries: [[bucket: "docs.reconfigureio-infra.com/ux/${env.BRANCH_NAME}/docs", excludedFile: '', flatten: false, gzipFiles: false, keepForever: true, managedArtifacts: false, noUploadOnFailure: true, selectedRegion: 'us-east-1', showDirectlyInBrowser: false, sourceFile: 'docs/build/html/**/*', storageClass: 'STANDARD', uploadFromSlave: true, useServerSideEncryption: false]], profileName: 's3', userMetadata: []])
            }

            stage 'clean'
            sh 'docker run -v $PWD/docs:/mnt "reconfigureio/sphinx:latest" make clean'
            sh 'docker run -v $PWD/dashboard:/mnt "reconfigureio/dashboard:latest" clean'


            notifySuccessful()
        }
    } catch (e) {
      currentBuild.result = "FAILED"
      notifyFailed()
      throw e
    }
}



def notifyStarted() {
    slackSend (color: '#FFFF00', message: "STARTED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
}

def notifySuccessful() {
    slackSend (color: '#00FF00', message: "SUCCESSFUL: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
}

def notifyFailed() {
  slackSend (color: '#FF0000', message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.BUILD_URL})")
}
