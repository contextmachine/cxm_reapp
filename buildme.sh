export IMAGE_TAG="sthv/cxm-viewer"
export DOCKER_BUILDKIT=1
docker build -t sthv/cxm-viewer . && docker run -p 0.0.0.0:30011:3000 -p 0.0.0.0:30011:3000/udp --name viewer sthv/cxm-viewer
