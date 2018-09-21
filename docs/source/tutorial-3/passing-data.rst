.. _sharing:

4 – Passing data around
------------------------
Data is shared between the host and FPGA using shared memory. Some arguments can be passed directly to the FPGA via its control register: This is most useful for passing memory addresses and data lengths. Small amounts of data can be passed this way but the usefulness is really limited – there isn't much space and it's slow to access. In most situations the host should place data into shared memory, and then pass a pointer to the location of that data to the FPGA.

Host CPU code
^^^^^^^^^^^^^
We can use a simple example of passing a small array from the host CPU to the FPGA and then have the FPGA send it back again. Starting with the code for the CPU, we need a |world| to interact with the FPGA and talk to shared memory on the FPGA card. We can create space within shared memory for specific purposes and send pointers to the FPGA so it knows where to look for our data, and where to store its results.

Sending data from the host to the FPGA is a three step process:

1. Create space in memory
2. Store data at that location
3. Pass a pointer to the FPGA so it knows where to find it

For this simple back and forth example we need to create our test data first, so let's make an array of 10 incrementing values, we'll call it ``input``::

      input := make([]uint32, 10)

      for i, _ := range input {
    		input[i] = uint32(i)
    	}

The code snippets for passing our test data to the FPGA look like this (remember these are out of context, please refer to the template above for the bigger picture):

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
The FPGA interacts with shared memory using the |smi| protocol. In the template above you can see we set up SMI ports for interacting with shared memory within the ``Top`` function in the FPGA code.

There are three steps to the FPGA getting hold of the sample array:

1. Receive the memory location from the host
2. Create a variable for the data
3. Use an |smi read burst| to read the data into that variable (at which point it will be stored in block RAM on the FPGA chip)

Here are the code snippets for these steps:

1. Receive the memory locations and data size from the host (the ``0``, ``1`` and ``2`` in ``krnl.SetMemoryArg...`` are translated by our comiler to be the first, second and third inputs to the FPGA)::

      inputData uintptr,
      outputData uintptr,
      length uint32,

2. Create a variable to hold the input data, we'll call it ``data``. This will be located within the FPGA's block RAM::

      data := make([]uint32, length)

3. Read the data from shared memory into the array ``data`` using an |smi read burst|::

      smi.ReadBurstUInt32(
        readReq, readResp, inputData, smi.DefaultOptions, length, data)

Now the FPGA has the sample array held within ``data``, let's send it back again. The process for getting an array from the FPGA's block RAM to the reserved space in shared memory is an |smi write burst| as follows::

      smi.WriteBurstUInt32(
        writeReq, writeResp, outputData, smi.DefaultOptions, length, data)

Back to the CPU code
^^^^^^^^^^^^^^^^^^^^
Now, moving back to the host CPU code, the host can collect the output data from shared memory and place it into a new variable ``output``::

      output := make([]uint32, len(input))
      binary.Read(outputBuff.Reader(), binary.LittleEndian, &output)

We have just followed an array from the CPU to the FPGA and back again using shared memory.

.. |smi| raw:: html

   <a href="https://godoc.org/github.com/ReconfigureIO/sdaccel/smi" target="_blank">SMI</a>

.. |smi read burst| raw:: html

  <a href="https://godoc.org/github.com/ReconfigureIO/sdaccel/smi#ReadBurstUInt32" target="_blank">SMI read burst</a>

.. |smi write burst| raw:: html

   <a href="https://godoc.org/github.com/ReconfigureIO/sdaccel/smi#WriteBurstUInt32" target="_blank">SMI write burst</a>
