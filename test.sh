#!/bin/bash

if [ ! -d "~/ionic-site" ]; then
  echo "checking out"
  echo "-- Cloning ionic-site#master to ~/ionic-site..."

  git config --global user.email "hi@ionicframework.com"
  git config --global user.name "Ionitron"

  ARGS=" --depth=3"
  git clone git@github.com:driftyco/ionic-site.git ~/ionic-site $ARGS
  cd ~/ionic-site
  git fetch origin --tags
else
  echo "using existing"
  cd ~/ionic-site
  git reset --hard
  git pull origin master
fi

echo "Test 2" > test.txt


git add -A
git commit -am "Testing"
git push origin master
