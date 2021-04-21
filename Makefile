all: dist/
	docker-compose build

dist/: src/ src/pages/
	npm run buildDev
