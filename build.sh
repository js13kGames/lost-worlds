#!/bin/bash

# Deps:
# apt-get install closure-compiler


mkdir -p tmp

cat \
	src/map.js \
	src/render.js \
	src/physics.js \
	src/events.js \
	src/main.js \
	> tmp/all.js

closure-compiler --compilation_level ADVANCED_OPTIMIZATIONS tmp/all.js >tmp/a.js
rm tmp/all.js

echo "<style>body{margin:0;overflow:hidden}</style><canvas id=c></canvas><script src=a.js></script>" \
	>tmp/index.html

cp src/map.png tmp/map.png

rm build.zip

echo "Would you like 50 more bytes? Remove this comment!" >archcomment
zip -z -9 -q -j build.zip tmp/* <archcomment
rm archcomment

SIZE=$( ls -al build.zip | cut -d ' ' -f 5 )

rm -r tmp

echo "Total size: $SIZE bytes"

if [ $SIZE -gt 13312 ]; then
	echo "TOO BIG!"
fi
