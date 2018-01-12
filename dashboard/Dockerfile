FROM node:6.11.1

RUN npm install -g bower@1.8.0 &&\
    npm install -g phantomjs@2.1.7 &&\
    npm install -g ember-cli@2.13.3

RUN apt-get update && apt-get install -y --no-install-recommends \
        rubygems \
        ruby-dev \
    && rm -rf /var/lib/apt/lists/* \
    && gem install sass -v 3.4.21 \
    && gem install compass -v 1.0.3

WORKDIR /myapp
