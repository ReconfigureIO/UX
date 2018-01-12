.. _addition:

Tutorial 2 – Filling in the Gaps
================================================
In this tutorial, we will look at pretty much the simplest calculation possible – adding two numbers together. This is to get you writing and testing your own code. We will look at the problem, discuss how to design the program, and then, once you've had a go at filling in some gaps in the code, you can simulate the program using ``test``. Then, we'll look at our full code solution. This tutorial assumes you have already run through our first tutorial: :ref:`demo`.

What's the problem?
-------------------
We want the FPGA to take two integers, 1 and 2, add them together and send the result back to us. As you saw in our first example, there's a host CPU which works with the FPGA, with communication happening across a control interface. So, the first thing we need to do is decide what each element needs to do and when. Then we can write some Go code to tell the host CPU how to communicate with the FPGA, as well as some Go code to program the FPGA to carry out the required tasks.

Let's break this process down. There are just two operands involved so the host can pass them straight to the FPGA along with an address at which to store the result. Then, the FPGA can add the numbers together and write the result back. The host can read the result and print it for us to see. A flow diagram could look like this:

.. figure:: AdditionDiagram.png
   :width: 90%
   :align: center

   Addition flow diagram

The example code
--------------------------
You should already have the code examples in your workspace after downloading them for the previous tutorial. If not, you can download them by running:

.. code-block:: shell

  git clone https://github.com/ReconfigureIO/examples.git && cd examples && git checkout v0.4.1

Filling in the gaps
-------------------
Navigate to ``examples/addition-gaps/cmd/test-addition/main.go`` to look at the incomplete code for the host CPU. You will notice some of the code is missing. Using the information given in the comments, along with the flowchart above, have a go at filling in the missing sections:

* Pass operands and results pointer to the kernal (**lines 28, 30 and 32**)
* Print the result from the FPGA (**line 48**)
* Create an ``if`` statement to exit if the result from the FPGA does not equal 3 (**lines 51-53**)

Once you have completed this, move on to the incomplete code for the FPGA, located at ``examples/addition-gaps/main.go``, and complete the following sections:

* Specify the operands and result pointer (**lines 18-20**)
* Perform the addition (**line 34**)

Check and then simulate your code
----------------------------------
Now the code is complete, make sure you are back in ``examples/addition-gaps`` and you can quickly check it for compatibility with the compiler. Any syntax errors will be flagged up here. For more information on our various error messages see :ref:`errors`::

  reco check

Next, once you have dealt with any errors, use our hardware simulator to test how your code will run on the FPGA. First, create a project to work within::

  reco project create addition

Then, set this to be the active project::

  reco project set addition

Now you can simulate using the ``test`` command::

  reco test run test-addition

.. admonition:: Getting in the queue

    Simulation should normally only take around 20 seconds but could be up to 10 minutes depending on what else is in the queue.

For more detailed descriptions of any error messages you might receive here, you can take a look at our troubleshooting section: :ref:`errors`.

The complete example
--------------------
Take a look at our full example to see if there are any differences between our code and yours, you can find it here: ``examples/addition``. First, here's the host code:

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
   :emphasize-lines: 21, 22, 23, 37

     package main

     import (
     	//  Import the entire framework for interracting with SDAccel from Go (including bundled verilog)
     	_ "github.com/ReconfigureIO/sdaccel"

     	// Use the new AXI protocol package for interracting with memory
     	aximemory "github.com/ReconfigureIO/sdaccel/axi/memory"
     	axiprotocol "github.com/ReconfigureIO/sdaccel/axi/protocol"

     	"github.com/ReconfigureIO/addition"
     )

     func Top(
     	// The first set of arguments to this function can be any number
     	// of Go primitive types and can be provided via `SetArg` on the host.

     	// For this example, we have 3 arguments: two operands to add
     	// together and an address in shared memory where the FPGA will
     	// store the output.
     	a uint32,
     	b uint32,
     	addr uintptr,

     	// Set up channels for interacting with the shared memory
     	memReadAddr chan<- axiprotocol.Addr,
     	memReadData <-chan axiprotocol.ReadData,

     	memWriteAddr chan<- axiprotocol.Addr,
     	memWriteData chan<- axiprotocol.WriteData,
     	memWriteResp <-chan axiprotocol.WriteResp) {

     	// Since we're not reading anything from memory, disable those reads
     	go axiprotocol.ReadDisable(memReadAddr, memReadData)

     	// Add the two input integers together
     	val := addition.Add(a, b)

     	// Write the result of the addition to the shared memory address provided by the host
     	aximemory.WriteUInt32(
     		memWriteAddr, memWriteData, memWriteResp, false, addr, val)
     }

What's next?
-------------
Now you've had a go at writing some code for yourself, lets go back to our histogram example for :ref:`tutorial 3 <demo2>` and deploy the build you started in tutorial 1 to an FPGA!
