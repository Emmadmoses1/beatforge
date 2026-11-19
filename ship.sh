#!/data/data/com.termux/files/usr/bin/bash
set -e
cd ~/beatforge
git add -A
git commit -m "${1:-update}" || true
git push
sleep 8
RUN=$(gh run list --commit "$(git rev-parse HEAD)" --limit 1 --json databaseId -q '.[0].databaseId')
gh run watch "$RUN" --exit-status || { gh run view "$RUN" --log-failed | grep -E "(^|[[:space:]])e: " | sed 's/^.*Z //' | head -40; exit 1; }
mkdir -p ~/storage/downloads
gh release download latest --pattern BeatForge.apk --clobber --dir ~/storage/downloads
termux-open ~/storage/downloads/BeatForge.apk
