# date > rss/AdAltaVoce.update
          
# find rss -maxdepth 1 -name "AdAltaVoce.update" -print -exec git add {} \;
# find rss -maxdepth 1 -name "*.xml" -exec dos2unix {} \;
# find rss -maxdepth 1 -name "*.xml" -print -exec git add {} \;
# find rss -maxdepth 1 -name "AdAltaVoce.date" -print -exec git add {} \;

# git diff --cached --quiet || git commit -m "Updated AdAltaVoce.xml from GitHub Actions"

git status > rss/AdAltaVoce.CommitStatus.txt

# git pushgit reb