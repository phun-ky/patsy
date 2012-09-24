lag en githubkonto hvis du ikke har

bli lagt til phun-ky/stage repo'en

installer git (command line)  msysgit!!

clone repositoriet i en mappe som har samme forelder som prosjektet du jobber i

Har du problemer med nøkler, lag egne nøkler! https://help.github.com/articles/generating-ssh-keys

installer node, siste versjon >= 0.9.2 

Go to: C:\Users\YourUserName
Create a file named .npmrc

Legg til: 

registry = http://registry.npmjs.org

Lagre

installer grunt@devel -g

endre evt filepaths i Gruntfile.js ( fra ../fpi-client/ til <ditt prosjekt navn, der mustachefilene ligger)

kjør grunt --force fra stage mappen

da vil alle .mustachefilene bli overvåket og bakt til template.js-filen 

dette systemet "stage", kan settes opp til å route til restapi, bake/minifisere less-filer (css) , bake/minifisere javascriptfiler

