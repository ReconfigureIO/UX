# variable definitions
NAME := dashboard
DESC := The code that powers app.reconfigure.io
VERSION := $(shell git describe --tags --always --dirty)

.PHONY: dependencies test build clean production

# development tasks
dependencies:
	npm install
	bower install --allow-root

test: dependencies
	ember test

build: dependencies
	BASE_URL=$(BASE_URL) ember build --environment=development

production: dependencies
	BASE_URL=$(BASE_URL) ember build --environment=production

clean:
	rm -rf dist
