.. _structure:

Tutorial – Structure and Communication
=========================================

.. toctree::
   :maxdepth: 4
   :hidden:

   tutorial-3/structure.rst
   tutorial-3/cpu.rst
   tutorial-3/fpga.rst
   tutorial-3/passing-data.rst
   tutorial-3/code.rst
   tutorial-3/branch.rst
   tutorial-3/write-the-code.rst
   tutorial-3/test-simple.rst
   tutorial-3/check-sim-simple.rst
   tutorial-3/more-data.rst
   tutorial-3/some-changes.rst
   tutorial-3/test-more-data.rst
   tutorial-3/check-sim-more-data.rst
   tutorial-3/conclusion.rst

.. sidebar:: Keeping up-to-date...

    Run ``reco update`` to check your version and update if required. The current version of our command line tool is |reco_version|.

In this tutorial we're going to cover structuring your programs and writing effective Go code for FPGAs. We'll look at our template project and use it to complete a couple of simple examples. Along the way we'll learn a bit more about the shared memory available on the FPGA card. **There are some elements that need to be present in your code to keep our compiler happy, and there are some areas where you're free to move and process data however you want. Also, we're not just dealing with an FPGA in isolation, Reconfigure.io programs include code for a host CPU as well as the FPGA, so you need to consider how best to split up the work between the two, and how to pass data around effectively, for more on this see our** :ref:`style guide <organization>`.

What we will do
------------------------
* :ref:`Look <structure-tutorial>` at our program structure
* :ref:`Look <requirements>` at the basic requirements for the CPU and FPGA code. A template is available |template|
* :ref:`Discuss <sharing>` how to share data between the host CPU and FPGA
* :ref:`Use <simple>` our template to create a simple program in which a single integer is passed from host CPU to the FPGA, multiplied by 2, and passed back to the host
* :ref:`Use <more-data>` the code above as the basis to create another program where an array of 10 integers is passed from the host to the FPGA, each integer is then multiplied by 2 and the resulting array is passed back to the host

.. |template| raw:: html

    <a href="https://github.com/ReconfigureIO/tutorials/tree/master/template" target="_blank">here</a>
