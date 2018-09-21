6 – Set up your project
------------------------
First, let's check you're using the latest version of our tutorial materials – |tutorials_version|. Open a terminal and navigate to where you cloned your fork of our tutorial materials (probably ``$GOPATH/src/github.com/<your-github-username>/tutorials``) and run::

    git describe --tags

If you have a different version, please run

.. subst-code-block::

    git fetch upstream
    git pull upstream master
    git checkout |tutorials_version|

We're going to be editing and adding to our template now so let's make a new branch to work on, call it ``multiply``::

  git checkout -b multiply

Now we can duplicate our template and rename it for this simple example::

  cp -r template multiply1
  cd multiply1/cmd
  mv test test-multiply1

So now you should have something like this::

    multiply1
    ├── README.md
    ├── cmd
    │   └── test-multiply1
    │       └── main.go
    ├── glide.yaml
    ├── main.go
    ├── main_test.go
    ├── reco.yml
    └── vendor
      └── ...
