echo "== Build iamge =="
docker build -t chernetsky/delu-vremya-bot .

# echo "== Login to Docker Hub =="
# docker login -u chernetsky

# echo "== Push image =="
# docker push chernetsky/delu-vremya-bot