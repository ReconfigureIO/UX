5 – Build
------------------
After running a successful simulation, the next step is to build the program. Running a build takes the program code and creates an image suitable for programming the FPGA instance. Our build process currently takes in the region of 4 hours. This is longer than we would like and is partly due to underlying silicon vender tools, which we are currently working to address. For this reason, we're not going to start a build now - we don't want you to have to wait that long to move on! So, we have a pre-built image ready for you to deploy in the next section.

As we're running though the workflow, it's still worth looking at how we would run a build, so here goes: running ``reco build run`` will take the program code in your current location, and compile, optimize and translate it into a deployable image. It's a good idea to add a message too so you can recall what the build was for later:

.. code-block:: shell

     $ reco build run - "something to help me recall what the build was for"
     INFO: [XOCC 60-629] Linking for hardware target
     INFO: [XOCC 60-423]   Target device: xilinx:adm-pcie-ku3:2ddr-xpr:3.2
     INFO: [XOCC 60-251]   Hardware accelerator integration...
     INFO: [XOCC 60-244] Generating system estimate report...
     INFO: [XOCC 60-677] Generated system_estimate.xtxt
     INFO: [XOCC 60-586] Created /data/job/<build_ID>/.reco-work/sdaccel/dist/xclbin/kernel_test.hw.xilinx_adm-pcie-ku3_2ddr-xpr_3_2.xclbin

     <build_ID>

The build ID referenced above will be a long string of characters, unique to each build. You will use the build ID to deploy the image. To retrieve a build ID you can either look at your recent activity on your |dashboard| or you can inspect a list of your builds by running ``reco build list``:

.. code-block:: shell

   $ reco build list
   id                                      started                 status                 Message
   5434e2c1-cafc-44ca-ab2d-969a2f33895d    2016-12-08T21:08:00Z    PROCESS STARTING       something to help me recall what the build is for
   0b15ec5c-f3ba-11e6-9f75-127f5e3af928    2016-12-08T17:01:00Z    COMPLETED              something to help me recall what the build is for
   cdb339dd-8fb5-457c-9439-3f40267678e8    2016-12-08T18:31:58Z    COMPLETED WITH ERROR   something to help me recall what the build is for

.. note::
   When you come to work on your own projects, you might create many different builds for the same code. The build list's date-stamping, status and associated messages help to identify the build you want to run. This information is also displayed on your |dashboard|.

.. |dashboard| raw:: html

    <a href="https://app.reconfigure.io/dashboard" target="_blank">dashboard</a>
