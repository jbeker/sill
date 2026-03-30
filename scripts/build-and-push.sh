#!/usr/bin/env bash
set -euo pipefail

REGISTRY="registry.confusticate.com"
PROJECT="sill"
IMAGES=("web" "api" "worker")

GIT_SHA=$(git rev-parse --short HEAD)
GIT_BRANCH=$(git rev-parse --abbrev-ref HEAD)

echo "Building images from commit ${GIT_SHA} on branch ${GIT_BRANCH}"
echo "Registry: ${REGISTRY}/${PROJECT}"
echo ""

for image in "${IMAGES[@]}"; do
  tag="${REGISTRY}/${PROJECT}/${image}"

  echo "==> Building ${image}..."
  docker build \
    -f "docker/Dockerfile.${image}" \
    -t "${tag}:${GIT_SHA}" \
    -t "${tag}:latest" \
    .

  echo "==> Pushing ${image}..."
  docker push "${tag}:${GIT_SHA}"
  docker push "${tag}:latest"

  echo ""
done

echo "Done. Pushed images:"
for image in "${IMAGES[@]}"; do
  echo "  ${REGISTRY}/${PROJECT}/${image}:${GIT_SHA}"
  echo "  ${REGISTRY}/${PROJECT}/${image}:latest"
done
