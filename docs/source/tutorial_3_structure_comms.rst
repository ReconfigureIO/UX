.. _structure:

Tutorial 3 – Structure and Communication
=========================================
.. admonition:: Make sure you're up to date.

    Run ``reco version`` to check your installation. Our current version is |reco_version|. If you need to update run ``reco update`` or see our :ref:`install/update instructions <install>`.

In this tutorial we're going to cover structuring your programs and writing effective Go code for FPGAs. We'll look at our template, which is available for you to use as the basis for new programs, and use it to complete a couple of examples. Along the way we'll learn a bit more about the shared memory available on the FPGA card. **There are some elements that need to be present in your code to keep our compiler happy, and there are some areas where you're free to move and process data however you want. Also, we're not just dealing with an FPGA in isolation, Reconfigure.io programs include code for a host CPU as well as the FPGA, so you need to consider how best to split up the work between the two, and how to pass data around effectively, for more on this see our** :ref:`style guide <organization>`.

What we will do
------------------------
* Look at general program structure
* A detailed look at the basic requirements for the CPU and FPGA code. A template is available in ``tutorials/template`` (There is an alternative version of this template using our new SMI protocol in ``tutorials/template-SMI``)
* Discuss how to share data between the host CPU and FPGA
* Use our template to create a simple program in which a single integer is passed from host CPU to the FPGA, multiplied by 2, and passed back to the host. (If you would rather just look at the solution, it's here: ``tutorials/multiply1``)
* Use the code above as the basis to create another program where an array of 10 integers is passed from the host to the FPGA, each integer is then multiplied by 2 and the resulting array is passed back to the host. (Again, if you would rather just look at the solution, it's here: ``tutorials/multiply-array``)

Program Structure
-----------------
Reconfigure.io programs all have the same structure, a main.go file for the FPGA and then a ``cmd/test`` directory containing the code for the CPU. You can have several main.go files for the host within the same program. When you come to simulate or run a build you can choose which host command to use by using the name of the 'test' directory it sits within, for example, to simulate the program below using ``reco`` you would navigate to the the ``my-program`` directory and run ``reco sim run test-my-program``.

.. image:: ProgramStructure.png

Next, we'll look at the structure of the two ``main.go`` files.

The CPU
--------
The host code can be really flexible. Using our subset of Go, you can structure the code to fit your specific requirements.

The host's job is to create, receive, manage and organize data and send it to the FPGA for processing, it also starts the FPGA running. The host then collects the processed output data from shared memory and displays/uses it as required.

There are a few elements that need to be included in your host code:

* A ``world`` needs to be set up for managing the FPGA so it can work correctly and clean up when the work is done. For more information on this, see the ``world`` entry in our |FPGA|.
* Set aside some space in shared memory to put data for the FPGA to collect, and to pass results back to the host.
* Pass data to the FPGA – input data, pointers to input data, a pointer to where you want the results to end up, maybe an expected length if you are passing an array etc.
* Set the FPGA running.

Here's a template::

  package main

  import (
    "os"
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

    ...

  }


The FPGA
-----------
The code for the FPGA should follow the same general structure for all projects. You'll notice we use ``func Top``, which is a requirement of our compiler:

* Specify the data that needs processing, either directly if it's just a few arguments, or by location if it's in shared memory - Our comiler relates this directly to the arguments sent over from the host as show above.
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
We've seen how Reconfigure.io projects consist of host and FPGA code and that data can be shared between them using the shared memory situated on the FPGA card. Some arguments can be passed directly to the FPGA using its control register, this is most commonly used for passing memory addresses and data lengths. Small amounts of data can be passed this way but the usefulness of this is really limited – there isn't much space and it's slow to access. In most situations the CPU should place data into shared memory, and then pass a pointer to the location of that data to the FPGA.

Host CPU code
^^^^^^^^^^^^^
So, lets look at how we actually do this. We can use a simple example of passing a small array from the host CPU to the FPGA and then have the FPGA send it back again. Starting with the code for the CPU, you can see from the template above that we need a |world| set up to interact with the FPGA, and we use this to let the CPU talk to the shared memory on the FPGA card. We can create spaces within shared memory for specific purposes, and send the addresses of these memory locations to the FPGA so it knows where to look for our data, and where to store its results.

Sending some data from the host to the FPGA is a three step process – create space in memory for our data, store data in that memory location, and pass the memory location to the FPGA so it knows where to find it. For this example we need to create our test data first, so lets make an array of 10 incrementing values::

      input := make([]uint32, 10)

      for i, _ := range input {
    		input[i] = uint32(i)
    	}

Next, the code snippets for passing our test data to the FPGA look like this (remember these are out of context, please refer to the template above for the bigger picture):

1. Create space in memory of the right size for our data, we need space to hold the data on its way to the FPGA and on its way back::

      inputBuff := world.Malloc(xcl.ReadOnly, uint(binary.size(input)))
      defer inputBuff.Free()

      outputBuff := world.Malloc(xcl.ReadOnly, uint(binary.size(input)))
      defer inputBuff.Free()

2. Write the data to the input memory location::

      binary.Write(inputBuff.Writer(), binary.LittleEndian, &input)

3. Send the memory locations and the size of the input data to the FPGA, we do this by setting arguments. These arguments are converted by our compiler into inputs to the FPGA::

      krnl.SetMemoryArg(0, inputBuff)
      krnl.SetMemoryArg(1, outputBuff)
      krnl.SetArg(2, uint32(len(input)))

FPGA code
^^^^^^^^^^
The FPGA interacts with shared memory using the |axi|. In the template above you can see we always set up channels to act as ports for interacting with shared memory within the ``Top`` function in the FPGA code.

So, the FPGA getting hold of the array requires three steps – first, the FPGA must receive the memory location from the host, then create a variable for the data and use an |axi_read| to read the data into that variable within the on-chip block RAM. Here are the code snippets for these steps:

1. Receive the memory locations and data size from the host (the ``0``, ``1`` and ``2`` in ``krnl.SetMemoryArg...`` are translated by our comiler to be the first, second and third inputs to the FPGA)::

      inputData uintptr,
      outputData uintptr,
      length uint32,

2. Create a variable called ``data`` to hold the input data, this will be located within the FPGA's block RAM::

      data := make([]uint32, length)

3. Read the data from shared memory into the variable ``data``::

      aximemory.ReadUInt32(
        memReadAddr, memReadData, false, inputData, data)

Now the FPGA has our array held within ``data``, let's send it back again. The process for getting data from the FPGA's block RAM to the reserved space in shared memory is an |axi_write| as follows::

  aximemory.WriteUInt32(
    memWriteAddr, memWriteData, memWriteResp, false, outputData, data)

Back to the CPU code
^^^^^^^^^^^^^^^^^^^^
Now, moving back to the host CPU code, the CPU can collect the output data from shared memory and place it into a new variable ``output``::

  output := make([]uint32, len(input))
  binary.Read(outputBuff.Reader(), binary.LittleEndian, &output)

So, there we go, we've followed an array from the CPU to the FPGA and back again using shared memory.

Let's write some code
----------------------
To explore these methods of passing data around further let's use our template to write two very simple programs. First, we'll pass one integer to the FPGA from the host. As we're passing a single integer it can go straight to the FPGA's control register. Then, let's tell the FPGA to multiply this integer by 2 and pass it back to the host. **The route back from the FPGA to the CPU is always via the shared memory**. As we have done in previous tutorials, lets first look at a flow diagram for this example:

.. figure:: StructureDiagram1.png
    :width: 90%
    :align: center

We can use our template to write the code to perform this multiplication. First, let's check you're using the latest version of our tutorial materials – |tutorials_version|. Open a terminal and navigate to where you cloned your fork of our tutorial materials (probably ``$GOPATH/src/github.com/<your-github-username>/tutorials``) and run::

    git describe --tags

If you have a different version, please run

.. subst-code-block::

    git fetch upstream
    git pull upstream master
    git checkout |tutorials_version|

We're going to be editing and adding to our template now so let's make a new branch to work on, call it ``multiply``::

  git checkout -b multiply

Now we can duplicate ``template`` and rename it for this simple example::

  cp -r template multiply1
  cd multiply1/cmd
  mv test test-multiply1

So now you should have something like this::

    multiply1
    ├── README.md
    ├── cmd
    │   └── test-multiply1
    │       └── main.go
    ├── glide.yaml
    ├── main.go
    ├── main_test.go
    └── vendor
      └── ...

#. Let's work on the host CPU code first. Open ``multiply1/cmd/test-multiply1/main.go`` in your chosen editor. Have a go at editing the template host code to do what's needed for the single integer multiplication described above. Here are some pointers:

* We're only passing one integer straight to the control register so we only need to make space in shared memory for the result from the FPGA, not the data we're sending *to* the FPGA.
* We only need to send two arguments to the FPGA: the integer to be used in the multiplication and the pointer to where we want the FPGA to store the result.
* Use the Go |binary| package to read the result back from shared memory and store it into a variable ready to print.
* Use the Go |fmt| package to print your result!

#. Now, open ``multiply1/main.go`` and write the FPGA code to complete the simple multiplication. Here are some pointers:

* Just two inputs to the FPGA need specifying, the integer to be multiplied and the pointer to where we're going to store the result.
* As we won't be *reading* anything from shared memory, we can disable this functionality using the |read_disable| package.
* All that's left is to do the multiplication. Create a simple multilply-by-2 function *outside* the ``Top`` function. You can call your multiplication function within ``Top``. This will allow you to test the code in your local Go environment. Then use the |axi_write| package to write the result to the correct location in shared memory so it can be picked up by the host.

#. Next you need to write a test file so you can test the code in your Go environment. There's lots of information on creating a test suite |tests, and a template ``main_test.go`` file is included in the template. You want to edit the template test file to check the multiplication function you wrote in your FPGA code above actually multiplies its input by 2.

Once you're happy with your code, let's commit those changes and push them to your ``multiply`` branch on github. First make sure you're in ``tutorials/multiply1`` and then run::

  git add main.go && cmd/test-addition/main.go
  git commit -m "multiply1 completed"
  git push origin multiply

Check and simulate
^^^^^^^^^^^^^^^^^^^
We're now going to use ``reco`` to debug and simulate your code, so lets create a project to work within::

  reco project create multiply1
  reco project set multiply1

First, you can type-check your code for compatibility with our compiler. From the ``tutorials/multiply1`` directory run ``reco check``, and if everything is ok, you should see::

  $ reco check
  GOPATH/src/github.com/<your-github-username>/tutorials/multiply1/main.go checked successfully

Once you've addressed any errors thrown up by ``reco check``, you can simulate how your code will run on an FPGA::

  $ reco sim run test-multiply1
  (.....)
  2

Once the compiler has run through the simulation, you should see the multiplication result displayed. When you're done, you can compare your code with ours, which you'll find here: ``tutorials/multiply1/``

More data
------------
In that example, as we only needed to pass a single argument from host to FPGA, we sent it straight to the FPGA's control register. This time we're going to pass an array, so we'll send it via the shared memory.

.. figure:: StructureDiagram2.png
    :width: 90%
    :align: center

You can use the code you created above as the basis for this and just make the changes required to pass more data. So, duplicate the ``multiply1`` directory and rename it to ``multiply-array``::

  cp -r multiply1 multiply-array
  cd multiply-array/cmd
  mv test test-multiply-array

You should have something like this::

  ├── multiply-array
      ├── cmd
      │   └── test-multiply-array
      │       └── main.go
      └── main.go

Open the host code ``multiply-array/cmd/test-multiply-array/main.go`` and edit to follow the new structure described by the flow diagram above. Here's some pointers:

* For this example we need two memory locations, one for the input array, and one for the output.
* You will need to create the data to send to the FPGA – an array of 10 integers and seed it with incrementing values (0-9).
* As above you can use the |binary| package to write your input data to memory.
* Use a for loop to display the results!

Then, open ``multiply-array/main.go`` and edit the FPGA code to follow this example. Here's some pointers.

* This time there are three inputs to the FPGA to specify: pointers to input and output data and the data length
* Now, we can read the input array into a channel using a |read_burst|, first make a channel, call it ``inputChan``, and then use a read burst to populate it with the input data. You can put this inside a goroutine so the reading in can happen at the same time as processing the data.
* Then, create a channel for the transformed data, call it ``transformedChan``, and create a goroutine with a for loop inside to multiply what's in ``inputChan`` by 2 and send it to ``transformedChan``.
* All that's left to do now is send the contents of ``transformedChan`` back to the results space in memory.

Check and simulate
^^^^^^^^^^^^^^^^^^^
You can type-check your code for compatibility with our compiler. From the ``multiply-array`` directory enter::

  reco check

Once you've addressed any errors thrown up by ``reco check``, you can simulate how your code will run on an FPGA::

  $ reco sim run test-multiply-array
  (.....)
  024681012141618

Once the compiler has run through the simulation, you should see the resulting array contents. Once you're done, you can compare your code with ours, as before.

What have we done
------------------
So, we've looked at how to structure your code to work with Reconfigure.io, and how to use our template as a basis for writing new programs. Also, we've seen how to pass arguments straight from the host to the FPGA using the control register, and pass data from the host to the FPGA via shared memory, and back again. Next, :ref:`tutorial 4 <graphstutorial>` shows you how to use dataflow graphs to optimize your FPGA code.

.. |FPGA| raw:: html

   <a href="http://godoc.reconfigure.io/v0.12.7/host/pkg/xcl/index.html#World" target="_blank">FPGA interface docs</a>

.. |world| raw:: html

   <a href="http://godoc.reconfigure.io/v0.12.7/host/pkg/xcl/index.html#World" target="_blank">'world'</a>

.. |axi| raw:: html

   <a href="http://godoc.reconfigure.io/v0.15.0/kernel/pkg/" target="_blank">AXI memory protocol</a>

.. |axi_read| raw:: html

   <a href="http://godoc.reconfigure.io/v0.15.0/kernel/pkg/axi/memory/index.html#ReadUInt32" target="_blank">AXI read</a>

.. |axi_write| raw:: html

   <a href="http://godoc.reconfigure.io/v0.15.0/kernel/pkg/axi/memory/index.html#WriteUInt32" target="_blank">AXI write</a>

.. |binary| raw:: html

   <a href="https://golang.org/pkg/encoding/binary/" target="_blank">binary</a>

.. |fmt| raw:: html

   <a href="https://golang.org/pkg/fmt/" target="_blank">fmt</a>

.. |read_disable| raw:: html

   <a href="http://godoc.reconfigure.io/v0.12.8/kernel/pkg/axi/protocol/index.html#ReadDisable" target="_blank">AXI protocol</a>

.. |read_burst| raw:: html

   <a href="http://godoc.reconfigure.io/v0.12.8/kernel/pkg/axi/memory/index.html#ReadBurstUInt32" target="_blank">Read Burst</a>

.. |tests| raw:: html

  <a href="https://golang.org/pkg/testing/" target="_blank">here</a>
