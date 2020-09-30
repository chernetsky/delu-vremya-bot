echo "== Build iamge =="
docker build -t chernetsky/delu-vremya-bot .

echo "== Login to Docker Hub =="
docker login -u chernetsky

echo "== Push image =="
docker push chernetsky/delu-vremya-bot

# echo "== Docker-compose up =="
# docker context use tanadug

# docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
## todo: Это не запускает контейнеры. Надо руками делать:
## - docker start dvb-db
## - docker start dvb

# docker context use default