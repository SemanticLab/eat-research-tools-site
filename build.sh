npm run build
rm -fr docs/*
mv dist/* docs/
sed -i -e 's/\/assets\//\/eat-research-tools-site\/assets\//g' docs/index.html
rm -f docs/index.html-e
