Tutorial 4 – Measuring the performance of your programs
======================================================

.. admonition:: Make sure you're up to date.

    Run ``reco version`` to check your installation. Our current version is |reco_version|. If you need to update run ``reco update`` or see our :ref:`install/update instructions <install>`.

Now you've got the tools you need to start writing your own Reconfigure.io programs, you are most likely interested in a way to see how long it's taking the FPGA to process your data, after all, speed is what it's all about! Luckily, we use Go for everything, so benchmarking is built-in to the testing framework we have on hand. We can use the benchmarking option included in the Go testing framework to create execution benchmarks for our programs to calculate how long it's taking the FPGA to process a data element through the algorithms we've written. This is interesting to us for a couple of reasons, first it can be used to compare speed with using programs written to perform the same data processing on CPU alone or other hardware acceleration platforms. Also, it gives you a means to track the progress and suitability of design iterations during development.

When benchmarking Reconfigure.io programs you will be using our command line tool `reco` rather than `go test -bench=` as you would for a straight up Go benchmark, and rather than including the benchmarking code itself in the `main_test.go` file, you’ll write a whole new host-side command to run the benchmark so you can find out how long the processing takes within the FPGA instance, from passing the data to memory, to getting a result back from memory.

What we will do
----------------
* Look at the structure of getting an execution benchmark for the simple example from the last tutorial - array multiplication.
* Look at benchmarks for a couple of our scalable examples
