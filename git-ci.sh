echo "start git commands"
git config --global user.email "yoshuakuttler@gmail.com"
git config --global user.name "Josh Kuttler"
git checkout master
git add .
git commit -m "This is a commit message from azure pipelines [skip ci]"
git push -u origin master