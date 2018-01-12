.. _demo:

Tutorial 1 – Workflow part 1
===============================================
This tutorial is a simple introduction to some of the Reconfigure.io workflow. It's all pretty straightforward so in a few minutes you will have done a hardware simulation of a project running on an FPGA, and then set a build running to use in a later tutorial.

**We will use a parallelized histogram example in this tutorial, in which a block of memory is filled with sample data before an FPGA is put to work classifying the samples into bins. The contents of each bin is then read out, providing the data required to draw a histogram. In this tutorial we will use the following commands to check, simulate and build our** ``histogram-array`` **example code:** ``go test`` **,** ``reco check`` **,** ``reco test run`` **and** ``reco build run`` **.**

From here, we're assuming you've already set up your account and installed ``reco`` – if not, see :ref:`setup`.

**If you haven't signed up yet you can do so** `here <http://reconfigure.io>`_.

.. _examples:

Setting up and testing
----------------------------
First off, download our code examples so we have something to work with. You can do this by running the following from a terminal:

.. code-block:: shell

  git clone https://github.com/ReconfigureIO/examples.git && cd examples && git checkout v0.4.1

From a terminal, navigate to the ``examples/histogram-array`` directory to access our example program. If you have opted to set up local Go tooling (setup instructions are :ref:`here <gotools>`), we can now test the code using ``go test``.

If you look inside the top directory you'll see a test ``main_test.go`` has been included. This checks that the FPGA can't calculate an invalid bin when sorting sample data:

.. code-block:: shell

    .
    ├── cmd
    │   └── test-histogram
    │       └── main.go
    ├── main.go
    └── main_test.go

Now you can run the test:

.. code-block:: shell

    go test

Check for compatibility with Reconfigure.io
-------------------------------------------
Now we can type check the code for the FPGA locally on your machine using ``reco``. This tells us whether the code is compatible with our compiler and will point out any syntactic errors. To do this run ``reco check`` and you should see:

.. code-block:: shell

   $ reco check
   /<your_path>/examples/histogram-array/main.go checked successfully

Simulate
--------
If you are using :ref:`vendor packages <packages>`, before uploading anything to our service it's a good idea to check they are up to date. Using glide, you can do this by running::

  glide install

Our tooling requires that you work within a project, so, before we start anything else, let's define a project to work within – call it ``histogram``::

  reco project create histogram

And set this to be the active project::

  reco project set histogram

You can now test the code with our hardware simulator by running ``reco test``. This is a really useful stage in our workflow as it allows you to see how the program will run on the FPGA before the more time-consuming build stage.

.. admonition:: Getting in the queue

    Simulation should normally only take around 20 seconds but could be up to 10 minutes depending on what else is in the queue.

When you simulate your own programs during development, you'll get helpful feedback in the form of error messages. Below is an example of the output you should see:

.. code-block:: shell

    $ reco test run test-histogram
    reco: 2017-06-27 15:12:13| preparing simulation
    reco: 2017-06-27 15:12:14| done
    reco: 2017-06-27 15:12:14| archiving
    reco: 2017-06-27 15:12:14| done
    reco: 2017-06-27 15:12:14| uploading ...
    reco: 2017-06-27 15:12:14| done
    reco: 2017-06-27 15:12:14| running simulation
    reco: 2017-06-27 15:12:14| you can run "reco log simulation fe8ac266-563f-4a91-abaa-21055edc7cb3" to manually stream logs
    reco: 2017-06-27 15:12:14| getting simulation details
    reco: 2017-06-27 15:12:14| status: QUEUED
    reco: 2017-06-27 15:12:14| this may take several minutes
    reco: 2017-06-27 15:12:14| waiting for simulation to start ...
    reco: 2017-06-27 15:12:24| status: STARTED
    reco: 2017-06-27 15:12:24| streaming logs
    ...
    INFO: [XOCC 60-629] Linking for hardware emulation target
    INFO: [XOCC 60-895]    Target platform: /opt/Xilinx/SDx/2017.1.op/platforms/xilinx_aws-vu9p-f1_4ddr-xpr-2pr_4_0/xilinx_aws-vu9p-f1_4ddr-xpr-2pr_4_0.xpfm
     ... INFO: [XOCC 60-423]   Target device: xilinx:aws-vu9p-f1:4ddr-xpr-2pr:4.0
    INFO: [XOCC 60-251]   Hardware accelerator integration...
    ...
    63872: 1
    64000: 0
    64128: 0
    64256: 0
    64384: 0
    64512: 0
    64640: 0
    64768: 0
    64896: 0
    65024: 0
    65152: 1
    65280: 1

Build
------------------
Now you can start a build of our histogram example code by running ``reco build``. The histogram program will be uploaded to the Reconfigure.io service and once the upload is complete the build will start immediately. Reconfigure.io will compile, optimize and convert the code into a format suitable for programming the FPGA.

.. admonition:: Time to put your feet up...

   Build times are currently in the region of 4 hours. This is longer than we would like and is partly due to underlying silicon vender tools, which we are currently working to address.

.. code-block:: shell

     $ reco build run
     INFO: [XOCC 60-629] Linking for hardware target
     INFO: [XOCC 60-423]   Target device: xilinx:adm-pcie-ku3:2ddr-xpr:3.2
     INFO: [XOCC 60-251]   Hardware accelerator integration......................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................................
     INFO: [XOCC 60-244] Generating system estimate report...
     INFO: [XOCC 60-677] Generated system_estimate.xtxt
     INFO: [XOCC 60-586] Created /data/job/0b15ec5c-f3ba-11e6-9f75-127f5e3af928/.reco-work/sdaccel/dist/xclbin/kernel_test.hw.xilinx_adm-pcie-ku3_2ddr-xpr_3_2.xclbin

     0b15ec5c-f3ba-11e6-9f75-127f5e3af928

The long string of characters displayed at the end there is the build ID. This is unique to each build and will help you identify one build from another when you come to deploy the program.

While that's running...
-----------------------------
Move on to :ref:`tutorial 2 <addition>` where we'll guide you through completing some code for a simple example, and we'll run through using the hardware simulator again. We'll pick this build up again in :ref:`tutorial 3 <demo2>`.
