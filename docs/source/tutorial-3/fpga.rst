3 – The FPGA
-------------
The code for the FPGA should follow the same general structure for all projects. You'll notice we use ``func Top()``, which is a requirement of our compiler:

* Specify the data that needs processing, either directly if it's just a few arguments, or by location if it's in shared memory – Our compiler relates this directly to the arguments sent over from the host as shown above.
* Specify where the FPGA should put its results.
* Set up SMI ports so the FPGA can interact with shared memory for collecting and returning data.
* Tell the FPGA what to do with the data – the important bit!
* Send results to shared memory.

Here's a template::

  package main

  import (
    // import the entire framework (including bundled verilog)
    _ "github.com/ReconfigureIO/sdaccel"

    // Use the SMI protocol package for interacting with shared memory
    "github.com/ReconfigureIO/sdaccel/smi"
  )

  func Top(
    // Specify inputs and outputs to and from the FPGA. Tell the FPGA where to find data in shared memory, what data type
    // to expect or pass single integers directly to the FPGA by sending them to the control register - see examples

    ...

    // Set up ports for interacting with the shared memory, here we have 2 SMI ports which can be used to read or write
    readReq chan<- smi.Flit64,
    readResp <-chan smi.Flit64,

    writeReq chan<- smi.Flit64,
    writeResp <-chan smi.Flit64) {

    // Read data in if required

    smi.ReadUInt32(
      readReq, readResp, <address_to_read_from>, smi.DefaultOptions, <where_to_write_it_to>
    )

    // Do whatever needs doing with the data from the host

    ...

    // Write the result to the location in shared memory as requested by the host
    smi.WriteUInt32(
      writeReq, writeResp, <address_to_write_to>, smi.DefaultOptions, <data_to_write>)
  }
