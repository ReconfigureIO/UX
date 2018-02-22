Setup, Updating and Authenticating
==================================

Update the command line tool - available from v0.5.0
------------------------------------------------------------
The current version of our tooling is |reco_version|. To check which version you have installed run ``reco version``.

To update to the current version of ``reco`` please run ``reco update`` and you will be guided through the process. If your current version is below v0.5.0, please use the installation instructions below to update.

.. _install:

Install/Update the command line tool
------------------------------
You will have been guided through installing our command line tool during the signup process, but here are the installation instructions should you need them again.

**Linux**: Run the following from your terminal, you may be asked to enter your password:

.. subst-code-block::

    curl -LO https://s3.amazonaws.com/reconfigure.io/reco/releases/reco-|reco_version|-x86_64-linux.zip \
    && unzip reco-|reco_version|-x86_64-linux.zip \
    && sudo mv reco /usr/local/bin

**OSX**: Run the following from your terminal, you may be asked to enter your password:

.. subst-code-block::


    curl -LO https://s3.amazonaws.com/reconfigure.io/reco/releases/reco-|reco_version|-x86_64-apple-darwin.zip \
    && unzip reco-|reco_version|-x86_64-apple-darwin.zip \
    && sudo mv reco /usr/local/bin

**Windows**: If you're a Windows user launch **Powershell** as administrator and paste:

..subst-code-block::

  Invoke-WebRequest https://s3.amazonaws.com/reconfigure.io/reco/releases/reco-|reco_version|-x86_64-pc-windows.zip -OutFile reco-|reco_version|-x86_64-pc-windows.zip;
  Expand-Archive -Path reco-|reco_version|-x86_64-pc-windows.zip -DestinationPath C:\reco -Force;
  setx PATH "$env:path;C:\reco" -m;

``reco`` will be available in further terminal/powershell sessions.

Authenticating your account
-----------------------------
You will be guided though authenticating your account during the signup process. If you have any issues or need to re-authenticate, run ``reco auth`` from a terminal and follow the instructions – you’ll need to enter your API key which you can find on your dashboard. You can access your dashboard directly using this link: http://app.reconfigure.io, or by logging in through our `website <https://reconfigure.io/>`_.

.. _gotools:

Using standard Go Tooling
-------------------------
Using Go tools during development means you'll be able to run tests against your code using ``go test`` and you'll see correct code highlighting in your editor. If you're new to Go, you'll need to run through a few steps first:

1. Download and install Go tools using one of the methods described `here <https://golang.org/doc/install>`_.
2. Now we'll set up your `Go workspace <https://golang.org/doc/code.html#Workspaces>`_. All your Reconfigure.io projects need to be within your ``GOPATH``. To set your ``GOPATH`` `environmental variable <https://golang.org/doc/code.html#GOPATH>`_, choose the instructions for your operating system (for alternative operating systems/shells visit the `go wiki <https://github.com/golang/go/wiki/SettingGOPATH>`_):

Linux/Mac OSX
^^^^^^^^^^^^^^
Run the following from a terminal::

    echo "export GOPATH=\$HOME/go" >> ~/.bash_profile
    echo "export GOBIN=\$GOPATH/bin"  >> ~/.bash_profile
    echo "export PATH=\$PATH:\$GOPATH/bin"  >> ~/.bash_profile

Now head back to :ref:`tutorial 1 <examples-linux>` to fork our examples repo.

Windows 10
^^^^^^^^^^
* Click on the Cortana 'search' icon in the toolbar and type ``env``, select 'Environment variables...'
* Click 'New' from the 'User variables' section
* Type ``GOPATH`` into the 'Variable name' field
* Type ``C:\go-work`` into the 'Variable value' field
* Click OK

Now head back to :ref:`tutorial 1 <examples-win>` to fork our examples repo.
