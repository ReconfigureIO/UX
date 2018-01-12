Setup, Updating and Authenticating
==================================

.. _install:

Update the command line tool
----------------------------
The current version of our tooling is **v0.4.1**. To check which version you have installed run ``reco version``.

To update to the current version of ``reco`` please follow the instructions for your operating system:

**Linux**: Run the following from your terminal, you may be asked to enter your password:

.. code-block:: shell

    curl -LO https://s3.amazonaws.com/reconfigure.io/reco/releases/reco-v0.4.1-x86_64-linux.zip \
    && unzip reco-v0.4.1-x86_64-linux.zip \
    && sudo mv reco /usr/local/bin

**OSX**: Run the following from your terminal, you may be asked to enter your password:

.. code-block:: shell

    curl -LO https://s3.amazonaws.com/reconfigure.io/reco/releases/reco-v0.4.1-x86_64-apple-darwin.zip \
    && unzip reco-v0.4.1-x86_64-apple-darwin.zip \
    && sudo mv reco /usr/local/bin

**Windows**: If you're a Windows user launch **Powershell** as administrator and paste:

.. code-block:: shell

  Invoke-WebRequest https://s3.amazonaws.com/reconfigure.io/reco/releases/reco-v0.4.1-x86_64-pc-windows.zip -OutFile reco-v0.4.1-x86_64-pc-windows.zip;
  Expand-Archive -Path reco-v0.4.1-x86_64-pc-windows.zip -DestinationPath C:\reco -Force;
  setx PATH "$env:path;C:\reco" -m;

``reco`` will be available in further terminal/powershell sessions.

Authenticating your account
-----------------------------
You will be guided though authenticating your account during the signup process. If you have any issues or need to re-authenticate, run ``reco auth`` from a terminal and follow the instructions – you’ll need to enter your API key which you can find on your dashboard. You can access your dashboard directly using this link: http://app.reconfigure.io, or by logging in through our `website <https://reconfigure.io/>`_.

.. _gotools:

Using standard Go Tooling
-------------------------
You can use standard Go tooling during development. If you set this up you will have access to correct Go in-editor checking, and you'll be able to run tests against your code using ``go test``. This is an optional but recommended feature. To use Go tools you'll need to run through a few steps:

1. Set up your local Go development environment (if you haven't already). Follow the instructions `here <https://golang.org/doc/install>`_.
2. Next, if you have already written some applications with Reconfigure.io, you will need to run a fix on them. First run:

   .. code-block:: shell

       go install github.com/ReconfigureIO/sdaccel/cmd/fix

  Then, in the root of any programs you have previously created, run:

  .. code-block:: shell

       fix .

3. Vendor our package for interacting with SDAccel from Go: http://github.com/ReconfigureIO/sdaccel. For information on how to vendor packages, see: :ref:`packages`.
