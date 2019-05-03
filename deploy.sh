git add -f dist && git commit -m "Deploy"
git push origin `git subtree split --prefix dist`:gh-pages --force
