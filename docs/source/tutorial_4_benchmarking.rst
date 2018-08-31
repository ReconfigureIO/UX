Tutorial 4 – Measuring the performance of your programs
======================================================
.. sidebar:: Keeping up-to-date...

    Run ``reco update`` to check your version and update if required. The current version of our command line tool is |reco_version|.

Now you've got the tools you need to start writing your own Reconfigure.io programs, you are most likely interested in a way to see how long it's taking the FPGA instance to process your data, after all, performance is what it's all about! Luckily, we use Go for everything, so benchmarking is built-in to the testing framework we have on hand. We can use the benchmarking option included in the Go testing framework to create benchmarks for our programs. **In this tutorial we'll consider a range of different benchmark options, from measuring how long it takes the FPGA to process a data element, to measuring the full system benchmark of the host and FPGA combined. Benchmarks are useful for several reasons: We could use benchmarks to compare speed with the same data processing being done on a CPU alone or other hardware acceleration platforms, also, benchmarks give us a means to track progress between design iterations as we make changes to optimize our Reconfigure.io programs while**.

What we will do
----------------
* Discuss our various benchmark options and look at our template benchmarking structure.
* Look at the structure for getting a full system benchmark for the multiply array example from tutorial 3.
* Look at the structure of our FPGA-side benchmark and apply this to our simple example.
* Using our scalable monte carlo example deploy two versions to see improvements in the benchmark.
* Use our benchmark template to add a benchmarking command to a simple scalable example.

What do we want to know?
------------------------
Reconfigure.io programs contain code for a whole FPGA instance, a Go program for the FPGA and another for the host CPU. The host CPU is responsible for collecting/defining sample data, creating the required space in shared memory, passing pointers to the FPGA and starting the FPGA running. So, there's a certain amount of set up and tear down work required in our programs on either side of the main work of the FPGA.

We can measure the performance of our Reconfigure.io programs in terms of the speed at which they can process data by using Go's benchmarking framework. **Go benchmarking is designed to run through a defined loop of code a number of times until it can report a stable benchmark for the process**, so using various methods we can decide at which point we want to start and stop the timer running, which means we have a good degree of control over what we're actually measuring.

In standard Go, benchmarking is part of the testing framework, so the benchmark would be defined within ``main_test.go`` and you would run it as you do ``go test`` with an added ``-bench=.`` parameter. **When benchmarking Reconfigure.io programs you will be using our command line tool** ``reco`` **rather than** ``go test -bench=.`` **, and rather than including the benchmarking code itself in the** ``main_test.go`` **file, you’ll write a whole new host-side command so you can run the benchmark during deployment.**

We've included the basics for two different benchmarks in our template, so let's look at those now:

FPGA-side benchmark
^^^^^^^^^^^^^^^^^^^
The Go testing framework runs through a loop of code over and over again, increasing the number of repeats (``b.N``) until it lasts long enough to be timed reliably. While developing our programs we're most interested in the speed at which the FPGA gets through our data, so a benchmark to measure just that is really useful. We'll look at a full system benchmark a bit later, which is also useful, but will include the slowest parts of the process in its results – writing to and reading from memory – so with that benchmark we wouldn't really be able to get a clear idea of how fast the FPGA itself is working, which we need when optimizing our code. If we want to benchmark just the FPGA-side code we need to pass this changing value, ``b.N``, *to* the FPGA, to be used to set the size of the sample data, if we do this, we know ``b.N`` iterations of the FPGA processing loop will be run, so we can get an accurate result. Then we can |reset| just before starting the FPGA running so we just measure the FPGA runtime and not the time it takes to transfer data to and from memory. Here's how this looks in our template:

.. code-block:: Go

    package main

    import (
    "encoding/binary"
    "fmt"
    "testing"

    "github.com/ReconfigureIO/sdaccel/xcl"
    )

    func BenchmarkKernel(world xcl.World, b *testing.B) {
      // Get our program
      program := world.Import("kernel_test")
      defer program.Release()

      // Get our kernel
      krnl := program.GetKernel("reconfigure_io_sdaccel_builder_stub_0_1")
      defer krnl.Release()

      // We need to create an input the size of B.N, so that the kernel
      // iterates B.N times
      input := make([]uint32, b.N)

      // create some sample input data, as an example here we're just filling the
      // input variable with incrementing uint32s
      for i, _ := range input {
       input[i] = uint32(i)
      }

      // Create input buffer
      inputBuff := world.Malloc(xcl.ReadOnly, uint(binary.Size(input)))
      defer inputBuff.Free()

      // Create variable and buffer for the result from the FPGA, in this template
      // we're assuming the result is the same size as the input
      result := make([]byte, b.N)
      outputBuff := world.Malloc(xcl.ReadWrite, uint(binary.Size(result)))
      defer outputBuff.Free()

      // Write input buffer
      binary.Write(inputBuff.Writer(), binary.LittleEndian, &input)

      // Set arguments – input buffer, output buffer and data length
      krnl.SetMemoryArg(0, inputBuff)
      krnl.SetMemoryArg(1, outputBuff)
      krnl.SetArg(2, uint32(len(input)))

      // Reset the timer so that we only benchmark the runtime of the FPGA
      b.ResetTimer()
      krnl.Run(1, 1, 1)
    }

    func main() {
      // Create the world
      world := xcl.NewWorld()
      defer world.Release()

      // Create a function that the benchmarking machinery can call
      f := func(b *testing.B) {
       BenchmarkKernel(world, b)
      }

      // Benchmark it
      result := testing.Benchmark(f)

      // Print the benchmark result
      fmt.Printf("%s\n", result.String())
    }

Full system benchmark
^^^^^^^^^^^^^^^^^^^^^
We can use Go's benchmarking framework to measure how long it takes for our full sample dataset to be processed, in this case, the loop we want to run through ``b.N`` iterations is from the host writing the sample data to memory, then passing the input and results pointers to the FPGA, the FPGA processing the sample data and passing it back to shared memory, and then the host fetching the results data and printing it out for us to see. Our template code for a full system benchmark looks like this:


Benchmarking a simple example
------------------------------
Probably the easiest way to see how this works, as usual, is to look at some very simple example code. Let's take the array multiplication example from the last tutorial. Our completed example is |multiply| (you can always have a go at using the same benchmark for your array multiplication code if you completed tutorial 3).

As we've done in previous tutorials, let's look at a flow diagram to see what we want the host and FPGA to do:

.. |multiply| raw:: html

   <a href="https://godoc.org/github.com/ReconfigureIO/sdaccel" target="_blank">here</a>

.. |reset| raw:: html

   <a href="https://golang.org/pkg/testing/#B.ResetTimer" target="_blank">reset the benchmarking timer</a>
