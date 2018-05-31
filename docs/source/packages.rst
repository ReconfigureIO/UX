.. _packages:

Go Packages
========================
We support the use of vendor packages in your Reconfigure.io projects. Below is a list of our packages, which have all been optimized to work well on FPGAs.

You will need to use |vendor| and you can use your favorite Go dependency manager to add a Package and use it in your programs. We recommend |glide|. You can follow their |install| instructions and then run the following command to initialize your workspace:

.. code-block:: shell

    glide create

Then, to vendor a package, run the following:

.. code-block:: shell

    glide get github.com/<package>

Here's a list of our open source packages:

SDAccel from Go
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
A library for interacting with SDAccel from Go:

.. code-block:: shell

    glide get https://github.com/ReconfigureIO/sdaccel

Fixed-point
^^^^^^^^^^^^^^^^^^^^^^^^^^
A fixed-point arithmetic library optimized for FPGA targets:

.. code-block:: shell

    glide get https://github.com/ReconfigureIO/fixed

Crypto
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
A library of cryptography algorithms designed to be run on FPGAs:

.. code-block:: shell

    glide get https://github.com/ReconfigureIO/crypto

Math
^^^^^
A collection of mathematical functions optimized for FPGAs

.. code-block:: shell

    glide get https://github.com/ReconfigureIO/math

.. |vendor| raw:: html

   <a href="https://blog.gopheracademy.com/advent-2015/vendor-folder/" target="_blank">Go's vendor mechanism</a>

.. |glide| raw:: html

   <a href="https://glide.readthedocs.io/en/latest/" target="_blank">glide</a>

.. |install| raw:: html

   <a href="https://glide.readthedocs.io/en/latest/#installing-glide" target="_blank">installation</a>
