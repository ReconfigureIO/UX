# UX
A combination of all the components that make up our user experience (website, dashboard, docs, reco)

## Dashboard
`docker-compose run --service-ports server` should make a local instance of the dashboard available on port 4200. 
API will deny requests from this instance though so add the following line to `/etc/hosts`:
`127.0.0.1 local.reconfigure.io`
