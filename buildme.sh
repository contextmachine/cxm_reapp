export IMAGE_TAG="cr.yandex/crpfskvn79g5ht8njq0k/cxm-viewer"
export DOCKER_BUILDKIT=1
docker build -t $IMAGE_TAG . && docker run -p 0.0.0.0:30011:3000 --name cxm-viewer $IMAGE_TAG
