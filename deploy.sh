git_commit_msg=

if [[ $1 == '' ]]
then
    git_commit_msg=fix
else
    git_commit_msg="$1"
fi

git add .
git commit -m "$git_commit_msg"
git push heroku # heroku git:remote -a [app name]
git push