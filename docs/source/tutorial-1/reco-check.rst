3 – Check for compatibility
-------------------------------------------
Now you can type-check the FPGA code using our command line tool ``reco``. This tells us whether the code is compatible with the Reconfigure.io compiler and will point out any syntactic errors. To do this run ``reco check`` and you should see:

.. code-block:: shell

   $ reco check
   /github.com/ReconfigureIO/examples/histogram-array/main.go checked successfully
