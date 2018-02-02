.. _structure:

Tutorial 3 – Structure and Communication
=========================================
.. admonition:: Make sure you're up to date.

    Run ``reco version`` to check if your installation in up-to-date. Our current version is |reco_version|. If you need to update, please head :ref:`here <install>` before moving on to the tutorial.

In this tutorial we're going to look at how to structure your programs to write effective Go code for FPGAs. There are some elements that need to be present in your code to keep our compiler happy, and there are some areas where you're free to move and process data however you want. Also, we're not just dealing with an FPGA in isolation, Reconfigure.io programs include code for a host CPU and an FPGA, so you need to consider how best to split up the work between the two, and how to pass data around effectively. For more on splitting your code between the CPU and FPGA, see our :ref:`style guide <organization>`.

First we're going to look at the general program structure and then cover the following:

* A detailed look at the basic requirements for the CPU and FPGA code. This is available as a template in ``examples/template``.
* Discuss how to share data between the CPU and FPGA.
* Using our template to create a simple program in which a single integer is passed from host CPU to the FPGA, multiplied by 2, and passed back to the host.
* Using the code above as the basis to create another program where an array of 10 integers is passed from the host to the FPGA, each integer is then multiplied by 2 and the resulting array is passed back to the host.

Program Structure
-----------------
First let's check you've got the most up-to-date version of our examples repo by running::

    cd $GOPATH/src/github.com/ReconfigureIO/examples
    git checkout v0.4.2

Reconfigure.io programs all have the same structure, a main.go file for the FPGA and then a ``cmd`` directory in which the code for the CPU is stored. You can have several main.go files for the host within the same program. When you come to simulate or run a build you can chose which host command to use by using the name of the 'test' directory it sits within, for examples, to simulate the program below using ``reco`` you would use the command ``reco test run test-my-program`` from the ``my-program`` directory.

.. image:: ProgramStructure.png

Next we'll look at the structure of the two ``main.go`` files.

The CPU
--------
The host code can be really flexible. Using our subset of Go, you can structure the code to fit your specific requirements.

The host's job is to create, manage and organize data and send it to the FPGA for processing, it also starts the FPGA running. The host then collects the processed output data from shared memory and displays/uses it as required.

There are a few elements that need to be included in your host code:

* A ``world`` needs to be set up for managing the FPGA so it can work correctly and clean up when the work is done. For more information on this, see the ``world`` entry in our `API docs <http://godoc.reconfigure.io/v0.12.7/host/pkg/xcl/index.html#World>`_.
* Set aside some space in shared memory for the FPGA to collect data and pass results back to the host.
* Pass data to the FPGA – input data, pointers to input data, a pointer to where you want the results to end up, maybe an expected length if you are passing an array etc.
* Set the FPGA running.

Here's a template::

  package main

  import (
      "os"
      "xcl"
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

      ...

  }


The FPGA
-----------
The code for the FPGA should follow the same general structure for all projects:

* Specify the data that needs processing, either directly if it's just a few arguments, or by location if it's in shared memory.
* Specify where the FPGA should put its results.
* Set up channels so the FPGA can interact with the shared memory for collecting and returning data.
* Tell the FPGA what to do with the data - the important bit!
* Send results to the shared memory.

Here's a template::

  package main

  import (
      // Import the entire framework for interracting with SDAccel from Go (including bundled verilog)
      _ "github.com/ReconfigureIO/sdaccel"

      // Use the new AXI protocol package for interracting with memory
      aximemory "github.com/ReconfigureIO/sdaccel/axi/memory"
      axiprotocol "github.com/ReconfigureIO/sdaccel/axi/protocol"
  )

  func Top(
      // Specify inputs and outputs to and from the FPGA. Tell the FPGA where to find data in shared memory, what data type
      // to expect or pass single integers directly to the FPGA by sending them to the control register

      ...

      // Set up channels for interacting with the shared memory
      memReadAddr chan<- axiprotocol.Addr,
      memReadData <-chan axiprotocol.ReadData,

      memWriteAddr chan<- axiprotocol.Addr,
      memWriteData chan<- axiprotocol.WriteData,
      memWriteResp <-chan axiprotocol.WriteResp) {

      // Do whatever needs doing with the data from the host

      ...

      // Write the result to the location in shared memory as requested by the host
      aximemory.WriteUInt32(
          memWriteAddr, memWriteData, memWriteResp, true, <results_pointer>, <results_data>)
  }


Passing data around
--------------------
We've seen how Reconfigure.io projects consist of host and FPGA code and that data needs to be passed between them. Small numbers of arguments can be passed directly to the FPGA using its control register, but the usefulness of this is really limited, there isn't much space and it's slow to access. In most situations the host should place data in shared memory, and then pass a pointer to the location of the data to the FPGA.

Start off simple
-----------------
So, how do we use these two methods of passing data? To explore this we can use our template to write two very simple programs. First, let's pass one integer to the FPGA from the host, directly to the FPGA's control register. Then, the FPGA can multiply this integer by 2 and pass it back to the host. **The route back from the FPGA to the CPU is always via the shared memory**. As we have done in previous tutorials, lets first look at a flow diagram for this example:

.. figure:: StructureDiagram1.png
    :width: 90%
    :align: center

We can use our template to write code to do this multiplication. First it's a good idea to make sure your ``examples`` directory is up to date, see our :ref:`getting started <examples>` guide. ``examples/template`` contains the template code we looked at above set out in our program format.

Duplicate ``template``, save it somewhere on your local machine, and rename ``template`` and ``test`` so you have::

  ├── multiply1
      ├── cmd
      │   └── test-multiply1
      │       └── main.go
      └── main.go

Then, open ``multiply1/cmd/test-multiply1/main.go`` in your chosen editor. Have a go at editing the template host code to do what's needed for the single integer multiplication described above. Here are some pointers:

* We're only passing one integer straight to the control register so we only need to make space in shared memory for the result from the FPGA, not the data we're sending *to* the FPGA.
* We only need to send two arguments to the FPGA, the integer to be used in the multiplication, and the pointer to where we want the FPGA to store the result.
* Use the golang `binary <https://golang.org/pkg/encoding/binary/>`_ package to read the result back from shared memory and store it into a variable ready to print.
* Use the golang `fmt <https://golang.org/pkg/fmt/>`_ package to print your result!

Now, open ``multiply1/main.go`` and edit to create your FPGA code to complete the simple multiplication. Here are some pointers:

* Just two inputs to the FPGA need specifying, the integer to be multiplied and the pointer to where we're going to store the result.
* As we won't be *reading* anything from shared memory, we can disable this functionality using the `axi protocol <http://godoc.reconfigure.io/v0.12.8/kernel/pkg/axi/protocol/index.html>`_ package.
* All that's left is to do the multiplication and then use the `AXI memory <http://godoc.reconfigure.io/v0.12.8/kernel/pkg/axi/memory/index.html>`_ package to write the result to the correct location in shared memory to be picked up by the host.

Check and simulate
^^^^^^^^^^^^^^^^^^^
You can type-check your code for compatibility with our compiler. From the ``multiply1`` directory enter::

  reco check

Once you've addressed any errors thrown up by ``reco check``, you can simulate how your code will run on an FPGA::

  $ reco sim run test-multiply1
  (.....)
  2

Once the compiler has run through the simulation, you should see the multiplication result displayed. When you're done, you can compare what you have done to our code, you can find it here: ``examples/tutorial3_examples/multiply1/``

More data
------------
In that last example, as we only needed to pass a single argument from host to FPGA, we sent it straight to the FPGA's control register. This time we're going to pass an array, so we'll send it via the shared memory.

.. figure:: StructureDiagram2.png
    :width: 90%
    :align: center

We can use the code we created above as the basis for this and just make the changes required to pass more data. So, duplicate the ``multiply1`` directory and rename it to ``multiply-array`` so you have::

  ├── multiply-array
      ├── cmd
      │   └── test-multiply-array
      │       └── main.go
      └── main.go

Open the host code ``multiply-array/cmd/test-multiply-array/main.go`` and edit to follow the new structure described by the flow diagram above. Here's some pointers:

* For this example we need two memory locations, one for the input array, and one for the output.
* You will need to create an array of 10 integers and seed it with incrementing values (0-9).
* As above you can use the `binary <https://golang.org/pkg/encoding/binary/>`_ package to write your input data to memory.
* Use a for loop to display the results!

Then, open ``multiply-array/main.go`` and edit the FPGA code to follow this example. Here's some pointers.

* This time there are three inputs to the FPGA to specify: pointers to input and output data and the data length
* Now, we can read the input array into a channel using a `Read Burst <http://godoc.reconfigure.io/v0.12.8/kernel/pkg/axi/memory/index.html#ReadBurstUInt32>`_, first make a channel, call it ``inputChan``, and then use a read burst to populate it with the input data. You can put this inside a goroutine so the reading in can happen at the same time as processing the data.
* Then, create a channel for the transformed data, call it ``transformedChan``, and create a goroutine with a for loop inside to multiply what's in ``inputChan`` by 2 and send it to ``transformedChan``.
* All that's left to do now is send the contents of ``transformedChan`` back to the results space in memory.

Check and simulate
^^^^^^^^^^^^^^^^^^^
You can type-check your code for compatibility with our compiler. From the ``multiply1`` directory enter::

  reco check

Once you've addressed any errors thrown up by ``reco check``, you can simulate how your code will run on an FPGA::

  $ reco sim run test-multiply1
  (.....)
  024681012141618

Once the compiler has run through the simulation, you should see the result array. Once you're done you can compare what you have to our solution, as before.

What have we done
------------------
So, we've looked at how to structure your code to work with Reconfigure.io, and how to use our template as a basis for writing programs. Also, we've seen how to pass arguments straight from the host to the FPGA using the control register, and pass data from the host to the FPGA via shared memory, and back again. Next, :ref:`tutorial 5 <graphstutorial>` shows you how to use dataflow graphs to optimize your FPGA code.
