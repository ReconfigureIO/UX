.. _examples:

1 – Clone our examples repository
----------------------------

First we need some code to work with. If you already use Go, and have your ``GOPATH``, workspace and tooling set up, and have |git| set up on your local machine, you can now clone our examples repo into your workspace by following the instructions for your operating system below.

If you are new to Go, please follow our :ref:`quick setup guide <gotools>` first.

.. _examples-linux:

Linux/MacOSX
^^^^^^^^^^^^
From a terminal copy and paste the following:

.. subst-code-block:: shell

    git clone https://github.com/Reconfigureio/examples.git $GOPATH/src/github.com/Reconfigureio/examples
    cd $GOPATH/src/github.com/Reconfigureio/examples
    git checkout |examples_version|

.. _examples-win:

Windows 10
^^^^^^^^^^
From a Powershell terminal copy and paste the following:

.. subst-code-block:: shell

    git clone https://github.com/Reconfigureio/examples.git $Env:GOPATH/src/github.com/Reconfigureio/examples
    cd $Env:GOPATH/src/github.com/Reconfigureio/examples
    git checkout |examples_version|

.. |git| raw:: html

   <a href="https://help.github.com/articles/set-up-git/#setting-up-git" target="_blank">git</a>
