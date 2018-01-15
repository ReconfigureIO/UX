def production_host = "docs.reconfigureio-infra.com"
def production_base = "/ux/production"
def staging_host = "docs.reconfigureio-infra.com"
def staging_base = "ux/${env.BRANCH_NAME}"

def production_bucket = "${production_host}${production_base}"
def staging_bucket = "${staging_host}${staging_base}"

notifyStarted()

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
                sh "docker run -v \$PWD/docs:/mnt --env-file=docs/vars/production.env 'reconfigureio/sphinx:latest' make html"
                sh "docker run -v \$PWD/dashboard:/mnt 'reconfigureio/dashboard:latest' make production BASE_URL=${production_base}/dashboard"
            }else{
                sh "docker run -v \$PWD/docs:/mnt --env-file=docs/vars/staging.env 'reconfigureio/sphinx:latest' make html"
                sh "docker run -v \$PWD/dashboard:/mnt 'reconfigureio/dashboard:latest' make build BASE_URL=${staging_base}/dashboard"
            }

            stage 'upload'

            if(env.BRANCH_NAME == "master") {
                step([$class: 'S3BucketPublisher', dontWaitForConcurrentBuildCompletion: false, entries: [[bucket: "${production_bucket}/dashboard", excludedFile: '', flatten: false, gzipFiles: false, keepForever: true, managedArtifacts: false, noUploadOnFailure: true, selectedRegion: 'us-east-1', showDirectlyInBrowser: false, sourceFile: 'dashboard/dist/**/*', storageClass: 'STANDARD', uploadFromSlave: true, useServerSideEncryption: false]], profileName: 's3', userMetadata: []])
                step([$class: 'S3BucketPublisher', dontWaitForConcurrentBuildCompletion: false, entries: [[bucket: "${production_bucket}/docs", excludedFile: '', flatten: false, gzipFiles: false, keepForever: true, managedArtifacts: false, noUploadOnFailure: true, selectedRegion: 'us-east-1', showDirectlyInBrowser: false, sourceFile: 'docs/build/html/**/*', storageClass: 'STANDARD', uploadFromSlave: true, useServerSideEncryption: false]], profileName: 's3', userMetadata: []])
            }else{
                step([$class: 'S3BucketPublisher', dontWaitForConcurrentBuildCompletion: false, entries: [[bucket: "${staging_bucket}/dashboard", excludedFile: '', flatten: false, gzipFiles: false, keepForever: true, managedArtifacts: false, noUploadOnFailure: true, selectedRegion: 'us-east-1', showDirectlyInBrowser: false, sourceFile: 'dashboard/dist/**/*', storageClass: 'STANDARD', uploadFromSlave: true, useServerSideEncryption: false]], profileName: 's3', userMetadata: []])
                step([$class: 'S3BucketPublisher', dontWaitForConcurrentBuildCompletion: false, entries: [[bucket: "${staging_bucket}/docs", excludedFile: '', flatten: false, gzipFiles: false, keepForever: true, managedArtifacts: false, noUploadOnFailure: true, selectedRegion: 'us-east-1', showDirectlyInBrowser: false, sourceFile: 'docs/build/html/**/*', storageClass: 'STANDARD', uploadFromSlave: true, useServerSideEncryption: false]], profileName: 's3', userMetadata: []])
            }

            stage 'clean'
            sh 'docker run -v $PWD/docs:/mnt "reconfigureio/sphinx:latest" make clean'
            sh 'docker run -v $PWD/dashboard:/mnt "reconfigureio/dashboard:latest" make clean'


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
