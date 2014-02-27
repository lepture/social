
build: components index.js social.css
	@component build --dev

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

compile:
	@echo '(function() {' > dist/widget.js
	@echo 'var module={};' >> dist/widget.js
	@cat index.js >> dist/widget.js
	@cat dist/helper.js >> dist/widget.js
	@echo '})();' >> dist/widget.js
	@uglifyjs dist/widget.js -m -o dist/widget.js
	@cat social.css > dist/widget.css
	@cat dist/style.css >> dist/widget.css
	@cleancss dist/widget.css -o dist/widget.css

gh-pages: compile
	@rm -fr .gh-pages
	@mkdir .gh-pages
	@cp example.html .gh-pages/index.html
	@cp social.css .gh-pages/
	@cp -r dist .gh-pages/

watch:
	@rewatch index.js -c "make compile"

.PHONY: clean gh-pages
