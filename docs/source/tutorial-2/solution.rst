6 – See how we did it
----------------------
Now you can take a look at our full example to see if there are any differences between our code and yours, you can find it in the ``examples`` repo you cloned in the previous tutorial. It's always a good idea to check you have the most up-to-date version of our examples, so, first, open a terminal and navigate to ``$GOPATH/src/github.com/Reconfigureio/examples`` and run::

    git describe --tags

If you have a version other than |examples_version|, please run

.. subst-code-block::

    git fetch
    git checkout |examples_version|

Here's the host code with the missing sections highlighted:

.. code-block:: Go
   :linenos:
   :emphasize-lines: 28, 30, 32, 48, 51, 52, 53

     package main

     import (
       "encoding/binary"
       "fmt"
       "github.com/ReconfigureIO/sdaccel/xcl"
       "os"
     )

     func main() {
       // Allocate a world for interacting with the FPGA
       world := xcl.NewWorld()
       defer world.Release()

       // Import the compiled code that will be loaded onto the FPGA (referred to here as a kernel)
       // Right now these two idenitifers are hard coded as an output from the build process
       krnl := world.Import("kernel_test").GetKernel("reconfigure_io_sdaccel_builder_stub_0_1")
       defer krnl.Release()

       // Allocate space in shared memory for the FPGA to store the result of the computation
       // The output is a uint32, so we need 4 bytes to store it
       buff := world.Malloc(xcl.WriteOnly, 4)
       defer buff.Free()

       // Pass the arguments to the kernel

       // Set the first operand to 1
       krnl.SetArg(0, 1)
       // Set the second operand to 2
       krnl.SetArg(1, 2)
       // Set the pointer to the result address in shared memory
       krnl.SetMemoryArg(2, buff)

       // Run the FPGA with the supplied arguments. This is the same for all projects.
       // The arguments ``(1, 1, 1)`` relate to x, y, z co-ordinates and correspond to our current
       // underlying technology.
       krnl.Run(1, 1, 1)

       // Create a variable for the result from the FPGA and read the result into it.
       // We have also set an error condition to tell us if the read fails.
       var ret uint32
       err := binary.Read(buff.Reader(), binary.LittleEndian, &ret)
       if err != nil {
         fmt.Println("binary.Read failed:", err)
       }

       // Print the value we got from the FPGA
       fmt.Printf("%d\n", ret)

       // Check the result is correct and if not, return an error
       if ret != 3 {
         os.Exit(1)
       }
     }

And here's the FPGA code:

.. code-block:: Go
   :linenos:
   :emphasize-lines: 23, 24, 25, 32

    package main

    import (
    //  Import the entire framework for interracting with SDAccel from Go (including bundled verilog)
    _ "github.com/ReconfigureIO/sdaccel"

    // Use the SMI protocol package
	  "github.com/ReconfigureIO/sdaccel/smi"
    )

    // function to add two uint32s
    func Add(a uint32, b uint32) uint32 {
    return a + b
    }

    func Top(
    // The first set of arguments to this function can be any number
    // of Go primitive types and can be provided via `SetArg` on the host.

    // For this example, we have 3 arguments: two operands to add
    // together and an address in shared memory where the FPGA will
    // store the output.
    a uint32,
    b uint32,
    addr uintptr,

    // Set up channel to write result to shared memory
  	writeReq chan<- smi.Flit64,
  	writeResp <-chan smi.Flit64) {

    // Add the two input integers together
    val := Add(a, b)

    // Write the result of the addition to the shared memory address provided by the host
    smi.WriteUInt32(
		writeReq, writeResp, addr, smi.DefaultOptions, val)
    }

What's next?
^^^^^^^^^^^^
Now you've had a go at writing some code for yourself, let's move on to :ref:`structure` to look in more detail at how we share data between the host CPU and FPGA, and we'll build on a project template to create another simple program.
