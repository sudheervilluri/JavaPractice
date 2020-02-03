
echo "Granting executable privilages to the custom git-hooks inside git_hooks folder.."

echo

# make all hook scripts inside git_hooks executable 
chmod -R +x git_hooks

echo "Mapping git-hooks to the git hooks configured in git_hooks directory.."

echo

# map the git-hooks to a custom git_hooks directory
git config core.hooksPath git_hooks

echo "git-hooks setup completed!!!!"