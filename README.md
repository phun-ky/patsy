DOWNLOAD THIS PROJECT
=====================

1. Download this project and put it into the same root folder as all your projects, like this:

```C:\Users\QE1\Workspace\Storebrand>dir

18.09.2012  14:42    <DIR>          .
18.09.2012  14:42    <DIR>          ..
02.10.2012  09:00    <DIR>          fpi-client
03.10.2012  08:44    <DIR>          stage```
             

**THIS IS VERY IMPORTANT**

INSTALL NODE
============

Install the latest version of node >= 0.9.2 

Use this link for Windows: http://nodejs.org/dist/v0.9.2/node-v0.9.2-x86.msi
Use this link for other platforms and choose your OS: http://nodejs.org/dist/v0.9.2/


INSTALL GRUNT
=============

1. Open a command line window with administrator priviligies (use a user with superuser priviligies on Linux)
2. Go to your home folder
	In Windows:     `C:\Users\YourUserName`

	In Linux:     `cd ~/`

3. Create a file named .npmrc
```touch .npmrc```

4. Add: 

```registry = http://registry.npmjs.org```

5. Save the file
6. Go into your stage folder 
6. Copy and paste this into your command line:
```npm install grunt@devel -g```


RUN BUILD SYSTEM
================

1. Type this in your command line in your **stage** folder and follow the instructions
```node start.js```

**All your mustache files will now be monitored and updated on change.**