PROJECTNAME="Pinput"

all: prelogue build archive epilogue

prelogue:
	@echo ""
	@echo ">>> $(PROJECTNAME) build started"
	@echo ""

node_modules: package.json
	@npm install

bower_components: bower.json
	@bower install

build: node_modules bower_components
	@gulp build

archive: ./dist
	@zip pinput.zip -r ./dist

epilogue:
	@echo ""
	@echo ">>> $(PROJECTNAME) build has successfully finished"
	@echo ""

.PHONY: prelogue build archive epilogue