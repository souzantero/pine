.PHONY: build run

build:
	docker build -t pine-server .

run:
	docker run --rm -p 8888:8888 \
		--env-file .env \
		-e DATABASE_URL="postgresql://postgres:postgres@host.docker.internal:5432/pine_db" \
		-e CHECKPOINT_SAVER_URL="postgresql://postgres:postgres@host.docker.internal:5432/pine_cs" \
		pine-server
