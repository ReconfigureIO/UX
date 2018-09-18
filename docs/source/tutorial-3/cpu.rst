2 – The CPU
------------
The host code can be really flexible and is written in standard Go. The host's jobs include creating, receiving, managing and organizing data for the FPGA to process. The host also starts the FPGA running.

There are a few elements that need to be included in your host code:

* A ``world`` needs to be set up for managing the FPGA so it can work correctly and clean up when the work is done. For more information on this, see the ``world`` entry in our |FPGA|.
* Set aside some space in shared memory for the FPGA to collect and deposit data as required.
* Pass data to the FPGA – input data, pointers to input data, a pointer to where you want the results to end up, maybe an expected length if you are passing an array etc.
* Set the FPGA running.

Here's a template::

  package main

  import (
    encoding/binary

    "github.com/ReconfigureIO/sdaccel/xcl"
  )

  func main() {
    // Allocate a 'world' for interacting with the FPGA
    world := xcl.NewWorld()
    defer world.Release()

    // Import the compiled code that will be loaded onto the FPGA (referred to here as a kernel)
    // Right now these two identifiers are hard coded as an output from the build process
    krnl := world.Import("kernel_test").GetKernel("reconfigure_io_sdaccel_builder_stub_0_1")
    defer krnl.Release()

    // Allocate a space in the shared memory to store the data you're sending to the FPGA and space
    // for the results from the FPGA
    inputBuff := world.Malloc(xcl.ReadOnly, <size here>)
    defer inputBuff.Free()

    outputBuff := world.Malloc(xcl.WriteOnly, <size here>)
    defer outputBuff.Free()

    // Create/get data and pass arguments to the FPGA as required. These could be small pieces of data,
    // pointers to memory, data lengths so the FPGA knows what to expect. This all depends on your project.
    // Usually, you will send data via shared memory, so you will need to write it to the space you allocated
    // above before passing the pointer to the FPGA.
    // We have passed three arguments here, you can pass more as neccessary

    // First argument
    krnl.SetArg(0, <first>)
    // Second argument
    krnl.SetArg(1, <second>)
    // Third argument
    krnl.SetMemoryArg(2, <third>)

    // Run the FPGA with the supplied arguments. This is the same for all projects.
    // The arguments ``(1, 1, 1)`` relate to x, y, z co-ordinates and correspond to our current
    // underlying technology.
    krnl.Run(1, 1, 1)

    // Display/use the results returned from the FPGA as required!

  }

.. |FPGA| raw:: html

   <a href="http://godoc.reconfigure.io/v0.12.7/host/pkg/xcl/index.html#World" target="_blank">FPGA interface docs</a>
