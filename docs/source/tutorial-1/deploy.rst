6 – Deploy an image
-------------------
Let's deploy our pre-built image for this example. Running a deployment will program the FPGA with the logic derived from the compiled and optimized Go code, and the specified host-side command will be run on the CPU. Please copy and run the following command to start the deployment:

.. subst-code-block::

    reco deploy run 31b835ac-5575-4ebc-b8c8-0007d629bd8f test-histogram

Once the deployment is complete you should see the histogram readout (we've cut it down here as it's quite long):

.. code-block:: shell

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

Next, we'll take a closer look at the example code...
