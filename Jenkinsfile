def production_zone = "reconfigure.io"
def staging_zone = "reconfigureio-infra.com"
def staging_base = "/${env.BRANCH_NAME}"

notifyStarted()

def zone = ""
def base = ""
if(env.BRANCH_NAME == "master") {
    zone = production_zone
} else {
    zone = staging_zone
    base = staging_base
}

node ('master') {
    try {
        timeout(time: 10, unit: 'MINUTES') {
            stage 'checkout'
            checkout scm

            stage 'lint'
            sh 'docker build -t "reconfigureio/sphinx:latest" docs'
            sh 'docker build -t "reconfigureio/dashboard:latest" dashboard/build'

            stage 'dashboard - test'
            dir ('dashboard/') {
                sh 'docker-compose run --rm test'
            }

            stage 'build'
            if(env.BRANCH_NAME == "master") {
                sh "docker run --init -v \$PWD/docs:/mnt --env-file=docs/vars/production.env 'reconfigureio/sphinx:latest' make html"
                sh "docker run --init -v \$PWD/dashboard:/mnt 'reconfigureio/dashboard:latest' make production"
            }else{
                sh "docker run --init -v \$PWD/docs:/mnt --env-file=docs/vars/staging.env 'reconfigureio/sphinx:latest' make html"
                sh "docker run --init -v \$PWD/dashboard:/mnt 'reconfigureio/dashboard:latest' make build BASE_URL=${staging_base}/"
            }

            stage 'upload'

            step([$class: 'S3BucketPublisher', dontWaitForConcurrentBuildCompletion: false, entries: [[bucket: "app.${zone}${base}", excludedFile: '', flatten: false, gzipFiles: false, keepForever: true, managedArtifacts: false, noUploadOnFailure: true, selectedRegion: 'us-east-1', showDirectlyInBrowser: false, sourceFile: 'dashboard/dist/**/*', storageClass: 'STANDARD', uploadFromSlave: true, useServerSideEncryption: false]], profileName: 's3', userMetadata: []])
            step([$class: 'S3BucketPublisher', dontWaitForConcurrentBuildCompletion: false, entries: [[bucket: "docs.${zone}${base}", excludedFile: '', flatten: false, gzipFiles: false, keepForever: true, managedArtifacts: false, noUploadOnFailure: true, selectedRegion: 'us-east-1', showDirectlyInBrowser: false, sourceFile: 'docs/build/html/**/*', storageClass: 'STANDARD', uploadFromSlave: true, useServerSideEncryption: false]], profileName: 's3', userMetadata: []])

            stage 'clean'
            sh 'docker run --init -v $PWD/docs:/mnt "reconfigureio/sphinx:latest" make clean'
            sh 'docker run --init -v $PWD/dashboard:/mnt "reconfigureio/dashboard:latest" make clean'


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
