.. _demo:



Tutorial 1 – Setup and workflow
===============================================

.. toctree::
   :maxdepth: 3
   :hidden:

   tutorial-1/clone-examples.rst
   tutorial-1/gotest.rst

.. sidebar:: Keeping up-to-date...

    Run ``reco update`` to check your version and update if required. The current version of our command line tool is |reco_version|.

This tutorial is a simple introduction to the Reconfigure.io workflow. We will use our parallelized histogram example, in which a block of memory is filled with sample data before an FPGA is put to work classifying the samples into bins. The contents of each bin is then read out, providing the data required to draw a histogram. **It's all pretty straightforward so in a few minutes you will have done a hardware simulation of a project running on an FPGA, and then deployed a build image of that project to an FPGA in the cloud.** If you would rather watch a video runthrough of the main points in this tutorial, you can do so |video|.

What we will do
----------------
* Check your Go environment is all set up
* Clone our examples repo
* Test our histogram example using ``go test``
* Run through our tooling workflow using ``reco`` to check, simulate and deploy a build image to a cloud FPGA
* Step through the code to see how it is structured

From here, we're assuming you've already set up your account and :ref:`installed and authenticated <install>` ``reco`` – if you don't have an account yet, please visit our `website <https://reconfigure.io/sign-up>`_.

.. |video| raw:: html

   <a href="https://youtu.be/yIHToaGI4_M" target="_blank">here</a>
