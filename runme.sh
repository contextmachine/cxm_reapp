chmod +x "load_dotenv"
eval "$(./load_dotenv build.env)"
echo "image tag: $IMAGE_TAG"
docker pull "$IMAGE_TAG" && docker run -p 0.0.0.0:30011:3000 --name cxm-viewer "$IMAGE_TAG"