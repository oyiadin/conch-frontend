all: dist/
	docker-compose build

dist/: src/
	npm run buildDev
