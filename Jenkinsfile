notifyStarted()

node ('master') {
    try {
        timeout(time: 10, unit: 'MINUTES') {
            stage 'checkout'
            checkout scm

            stage 'lint'
            sh 'cd docs && docker build -t "reconfigureio/sphinx:latest" .'

            stage 'build'
            sh 'cd docs && docker run -v $PWD:/mnt "reconfigureio/sphinx:latest" make html'

            stage 'upload'

            if(env.BRANCH_NAME == "master") {
                step([$class: 'S3BucketPublisher', dontWaitForConcurrentBuildCompletion: false, entries: [[bucket: "docs.reconfigureio-infra.com/ux/production", excludedFile: '', flatten: false, gzipFiles: false, keepForever: true, managedArtifacts: false, noUploadOnFailure: true, selectedRegion: 'us-east-1', showDirectlyInBrowser: false, sourceFile: 'docs/build/html/**/*', storageClass: 'STANDARD', uploadFromSlave: true, useServerSideEncryption: false]], profileName: 's3', userMetadata: []])
            }else{
                step([$class: 'S3BucketPublisher', dontWaitForConcurrentBuildCompletion: false, entries: [[bucket: "docs.reconfigureio-infra.com/ux/${env.BRANCH_NAME}", excludedFile: '', flatten: false, gzipFiles: false, keepForever: true, managedArtifacts: false, noUploadOnFailure: true, selectedRegion: 'us-east-1', showDirectlyInBrowser: false, sourceFile: 'docs/build/html/**/*', storageClass: 'STANDARD', uploadFromSlave: true, useServerSideEncryption: false]], profileName: 's3', userMetadata: []])
            }

            stage 'clean'
            sh 'cd docs && docker run -v $PWD:/mnt "reconfigureio/sphinx:latest" make clean'

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
