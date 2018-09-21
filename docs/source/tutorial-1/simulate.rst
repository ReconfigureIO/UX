4 – Simulate
------------
The check that we just ran runs on your loca machine. From this next step onwards you will be uploading code to our cloud service so our tooling requires that you work within a project, so, before we start anything else, let's define a project – call it ``histogram``, and set that project to be active::

  reco project create histogram
  reco project set histogram

You can now simulate the program using the ``reco sim`` command. This is a really useful stage in our workflow as it allows you to see how the program will run on the FPGA before the more time-intensive build step.

.. admonition:: Getting in the queue

    Simulation should normally only take around 5 minutes but could be up to 30 minutes depending on what else is in the queue.

Run ``reco sim run test-histogram`` and you should see:

.. code-block:: shell

    $ reco test run test-histogram
    preparing simulation
    done
    archiving
    done
    uploading
    done
    running simulation
    status: QUEUED
    Waiting for Batch job to start
    status: STARTED
    ...
    INFO: [XOCC 60-629] Linking for hardware emulation target
    INFO: [XOCC 60-895]    Target platform: /opt/Xilinx/SDx/2017.1.op/platforms/xilinx_aws-vu9p-f1_4ddr-xpr-2pr_4_0/xilinx_aws-vu9p-f1_4ddr-xpr-2pr_4_0.xpfm
    INFO: [XOCC 60-423]   Target device: xilinx:aws-vu9p-f1:4ddr-xpr-2pr:4.0
    INFO: [XOCC 60-251]   Hardware accelerator integration...
    INFO: [XOCC 60-244] Generating system estimate report...
    INFO: [XOCC 60-677] Generated system_estimate.xtxt
    INFO: [XOCC 60-586] Created /mnt/.reco-work/sdaccel/dist/xclbin/kernel_test.hw_emu.xilinx_aws-vu9p-f1_4ddr-xpr-2pr_4_0.xclbin
    INFO: [XOCC 60-791] Total elapsed time: 0h 1m 54s
    INFO: [SDx-EM 01] Hardware emulation runs detailed simulation underneath. It may take long time for large data set. Please use a small dataset for faster execution. You can still get performance trend for your kernel with smaller dataset.
    ...
    0: 0
    128: 0
    256: 0
    384: 0
    512: 0
    640: 0
    768: 0
    896: 0
    1024: 1
    ...
    64256: 0
    64384: 0
    64512: 0
    64640: 0
    64768: 0
    64896: 0
    65024: 0
    65152: 1
    65280: 1
    57216: 0

We've shortened the logs and output here as it's pretty long, but you can see the histogram data generated at the end there, bins on the left and data counts of the right.
