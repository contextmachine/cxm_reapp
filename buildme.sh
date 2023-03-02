chmod +x "load_dotenv"
eval "$(./load_dotenv build.env)"
# shellcheck disable=SC2028
echo "image tag: $IMAGE_TAG\nbuildx: $DOCKER_BUILDKIT"
# if no buildx instance
#docker buildx create --name=cxm-viewer-builder --use
docker buildx build -t "$IMAGE_TAG" --platform=linux/amd64,linux/arm64 --push=true .
docker buildx prune -a -f