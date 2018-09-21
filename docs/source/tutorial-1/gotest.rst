.. _test:

2 – Run a test
--------------
Now we've got everything set up and in the right place, we can check it's all working by running a test on our histogram-array example using ``go test``.

If you look inside ``examples/histogram-array`` you'll see how our projects are structured: the two main.go files make up the program, a ``reco.yml`` file, which contains basic memory interface settings including the number of ports required for this program between the FPGA and shared memory. There's also a test file – ``main_test.go`` – for checking that the program operates correctly, and a vendor folder containing our package for interacting with SDAccel using Go, including all the components that allow the host CPU to talk to the FPGA card, and the FPGA chip itself to talk the the shared memory situated on the FPGA card. The contents of the vendor folder, and the glide files associated with vendoring aren't displayed here because there's a lot in there and we don't need to look at it now:

.. code-block:: shell

    .
    ├── README.md
    ├── cmd
    │   └── test-histogram
    │       └── main.go
    ├── main.go
    ├── main_test.go
    ├── reco.yml
    └── vendor
      └── ...

For this example, ``main_test.go`` checks that the FPGA will not calculate an invalid bin when sorting data samples. Run ``go test`` now and you should see:

.. code-block:: shell

    $ go test
    PASS
    ok      /github.com/ReconfigureIO/examples/histogram-array    0.005s

This shows us that your Go environment is set up correctly and the code passes the conditions set in ``main_test.go``.
