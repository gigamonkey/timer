files := index.html
files += style.css
files += script.js

all: pretty lint

pretty:
	prettier -w --print-width 120 *.js *.css *.html

publish:
	./publish.sh $(files)
