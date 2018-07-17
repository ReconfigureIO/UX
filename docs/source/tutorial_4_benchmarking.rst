Tutorial 4 – Measuring the performance of your programs
======================================================

.. admonition:: Make sure you're up to date.

    Run ``reco version`` to check your installation. Our current version is |reco_version|. If you need to update run ``reco update`` or see our :ref:`install/update instructions <install>`.

Now you've got the tools you need to start writing your own Reconfigure.io programs, you are most likely interested in a way to see how long it's taking the FPGA to process your data, after all, speed is what it's all about! Luckily, we use Go for everything, so benchmarking is built-in to the testing framework we have on hand. We can use the benchmarking option included in the Go testing framework to create execution benchmarks for our programs to calculate how long it's taking the FPGA to process a data element through the algorithms we've written. This is interesting to us for a couple of reasons, first it can be used to compare speed with using programs written to perform the same data processing on CPU alone or other hardware acceleration platforms. Also, it gives you a means to track the progress and suitability of design iterations during development.

What we will do
----------------
* Discuss what we mean by 'execution benchmark' and look at our template structure
* Look at the structure of getting an execution benchmark for one of the simple examples from the last tutorial - array multiplication.
* Using one of our scalable examples deploy two versions of the example to see benchmark improvements
* Use our template benchmark to add a benchmarking command to our simple scalable example, Max.

What do we want to know?
------------------------
Reconfigure.io programs contain code for a whole FPGA instance, a Go program for the FPGA and another for the host CPU. The host CPU is responsible for collecting sample data, creating the required space in memory, passing pointers to the FPGA and starting the FPGA running. So, there's a certain amount of set up and tear down work required in our programs.

We can measure the performance of our Reconfigure.io programs in terms of the speed at which we can process data by using Go's benchmarking framework, the structure of which is designed to run through a defined loop of code a number of times until it can report a stable benchmark for the process. So we can decide at which point we want to start and stop the timer running. In standard Go, benchmarking is part of the testing framework, so the benchmark would be defined within ``main_test.go`` and you would run it as you do ``go test`` with an added ``-bench=.`` parameter. When benchmarking Reconfigure.io programs you will be using our command line tool `reco` rather than `go test -bench=.`, and rather than including the benchmarking code itself in the `main_test.go` file, you’ll write a whole new host-side command so you can run the benchmark during deployment to find out how long your data processing takes from passing the data to memory, to getting a result back from the FPGA, we're calling this an execution benchmark.

Benchmarking a simple example
------------------------------
Probably the easiest way to see how this works, as usual, is to look at some very simple example code. Let's take the array multiplication example from the last tutorial. Our completed example is |multiply| (you can always have a go at using the same benchmark for your array multiplication code if you completed tutorial 3).

.. |multiply| raw:: html

   <a href="https://godoc.org/github.com/ReconfigureIO/sdaccel" target="_blank">here</a>
