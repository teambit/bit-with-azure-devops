# npm install for [Bit components](https://github.com/teambit/bit) during CI (for projects that install components)

- Create new Pipelines and link your GitHub project.
- Clone your repo.
- In the panel click "Edit" to open the yml file, then click on "Variables".
- Click on "New variable", set Name to "BIT_TOKEN", and set Value need to be your bit token(bit config get user.token), then click on Save.
- Create another variable and set Name to "BIT_COLLECTION", and the value to your bit collection that you want to export.
- In your project root directory add an `.npmrc` file and put the following code inside:

```
@bit:registry=https://node.bit.dev
//node.bit.dev/:_authToken=$BIT_TOKEN
always-auth=true
```
create also `.env.local` file in your project root directory to be able to install localy from the registry:
```
BIT_TOKEN=<copy the value you get from this: bit config get user.token>
```
- Create an `npm-ci.sh` file in your project root directory with the following commands:
```
npm install
```
this will install all the dependencies from the pacakge.json.
- Edit the `azure-pipelines.yml` file, with the following commands in script section:
```
- script: |
    ./npm-ci.sh
```
Make sure the file has execution permissions by running `chmod +x ./npm-ci.sh`.
- Now you can run the pipelines and the build should work.
Learn more about [variables in Azure DevOps](https://docs.microsoft.com/en-us/azure/devops/pipelines/process/variables?view=azure-devops&tabs=yaml%2Cbatch)

# bit import from private components during CI 
If you project import a component from with `bit import ...`, and your package.json have a dependencies with a locale link to components folder like this, follow the following setups:
```
"@bit/<USER-NAME>.<COLLECTION-NAME>.<COMPONENT-ID>": "file:./components/<COMPONENT-ID>"
```
- Edit the `npm-ci.sh` and add this command: `npm install bit-bin -g`, now the file should look like this:
```
npm install
npm install bit-bin -g
```
- Add this command in your package.json to import the components and build them:  
```
"scripts": {
    ...
    "bit-build": "bit -v && bit import && bit build"
  },
```
- Edit the `azure-pipelines.yml`file to configure bit on the server and to run the `bit-build` command before building the project:
```
- script: |
    ./npm-ci.sh
    
    bit config set analytics_reporting false
    bit config set anonymous_reporting false
    bit config set user.token $(BIT_TOKEN)
    bit config 
 
    npm run bit-build
    npm run build

  displayName: 'npm install & build'
```

# bit export to private collection during CI
- Create a private collection in [bit.dev](bit.dev).
- Import the [compiler you need](https://bit.dev/bit/envs).
- Track, Tag and export components to your collection, [Alert component for example](src/components/Alert.js).
- Modify the `azure-pipelines.yml` file, and add the bit tag and bit export commands after the build:
```
- script: |
    ./npm-ci.sh
    
    bit config set analytics_reporting false
    bit config set anonymous_reporting false
    bit config set user.token $(BIT_TOKEN)
    bit config 
 
    npm run bit-build
    npm run build
    
    bit status
    bit tag -a
    bit export $(BIT_COLLECTION)

  displayName: 'npm install & bit config & npm build & bit export components if needed'
```

# git commit back after exported new version components during CI
- First you need to allow azure to do this changes, follow this setups in [azure](https://docs.microsoft.com/en-us/azure/devops/pipelines/scripts/git-commands?view=azure-devops&tabs=yaml).
- Create a `git-ci.sh` file in the root of your project, and add the following commands:
```
git config --global user.email "you@example.com"
git config --global user.name "Your Name"
git checkout master
git add .
git commit -m "This is a commit message from azure pipelines [skip ci]"
git push -u origin master
```
Make sure the file has execution permissions by running `chmod +x ./git-ci.sh`. 
- Edit the `azure-pipelines.yml` file and add just one line to run this file:
```
- script: |
    ./npm-ci.sh
    
    bit config set analytics_reporting false
    bit config set anonymous_reporting false
    bit config set user.token $(BIT_TOKEN)
    bit config 
 
    npm run bit-build
    npm run build
    
    bit status
    bit tag -a
    bit export $(BIT_COLLECTION)

    ./git-ci.sh

  displayName: 'npm install & bit config & npm build & bit export components if needed & git commit back'
```
- Now you can change your components, and commit the changes, and every thing should work in the CI.
- After this, the workspace need be update with all the changes the CI do with new version of components, to do this just run the following command to get all the updates:
```
git pull
bit import
```
### Get help

Get [help on Gitter here](https://gitter.im/bit-src/Bit).
