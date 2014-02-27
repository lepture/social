
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

.PHONY: clean
