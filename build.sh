#!/usr/bin/env bash
set -e

export REPO_NAME=kartoza
export SERVICE_NAME=kobotoolbox_kpi
export IMAGE_NAME=${SERVICE_NAME}
export TAG_NAME=2.018.32
export BUILD_ARGS="--pull --no-cache"

echo "Build: $REPO_NAME/$IMAGE_NAME:$TAG_NAME"

docker build -t ${REPO_NAME}/${IMAGE_NAME} \
	${BUILD_ARGS} .
docker tag ${REPO_NAME}/${IMAGE_NAME}:latest ${REPO_NAME}/${IMAGE_NAME}:${TAG_NAME}
docker push ${REPO_NAME}/${IMAGE_NAME}:${TAG_NAME}
