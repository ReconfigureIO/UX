11 – Let's make some changes
----------------------------
Open the host code ``multiply-array/cmd/test-multiply-array/main.go`` and edit to follow the new structure described by the flow diagram above. Here's some pointers:

* For this example we need two memory locations, one for the input array, and one for the output. When passing these over to the FPGA we also need to specify the length.
* You will need to create the data to send to the FPGA – an array of 10 integers and seed it with incrementing values (0-9).
* As in the last example you can use the |binary| package to write your input data to memory.
* This time the variable to hold the result will need to be an array of the length of the input array
* Use the |log| package to display the results.

Then, open ``multiply-array/main.go`` and edit the FPGA code to follow this example. Here's some pointers.

* This time there are three inputs to the FPGA to specify: pointers to input and output data and the data length
* You need an smi read port this time, as we'll be reading the input from shared memory. Also, remember to change the number of ports required to ``2`` in the project's ``reco.yml`` file.
* Now, we can read the input array into a channel using an |smi read burst|. First, make a channel, call it ``inputChan``, and then use a read burst to populate it with the input data. You can put this inside a goroutine so the reading in can happen at the same time as processing the data.
* Then, create a channel for the transformed data, call it ``transformedChan``, and create a goroutine with a for loop inside to multiply each integer in ``inputChan`` by 2 and send it to ``transformedChan``. You can use your ``Multiply`` function from the last example for this.
* All that's left to do now is send the contents of ``transformedChan`` back to the results space in shared memory using a |smi write burst|.

Once you're happy with your code, let's commit those changes and push them to your ``multiply`` branch on github. First make sure you're in ``tutorials/multiply-array`` and then run::

  git add main.go && cmd/test-multiply-array/main.go
  git commit -m "multiply array completed"
  git push origin multiply

.. |FPGA| raw:: html

   <a href="http://godoc.reconfigure.io/v0.12.7/host/pkg/xcl/index.html#World" target="_blank">FPGA interface docs</a>

.. |world| raw:: html

   <a href="http://godoc.reconfigure.io/v0.12.7/host/pkg/xcl/index.html#World" target="_blank">World</a>

.. |smi| raw:: html

   <a href="https://godoc.org/github.com/ReconfigureIO/sdaccel/smi" target="_blank">SMI</a>

.. |binary| raw:: html

   <a href="https://golang.org/pkg/encoding/binary/" target="_blank">binary</a>

.. |log| raw:: html

   <a href="https://golang.org/pkg/log/" target="_blank">log</a>

.. |smi read burst| raw:: html

   <a href="https://godoc.org/github.com/ReconfigureIO/sdaccel/smi#ReadBurstUInt32" target="_blank">SMI read burst</a>

.. |smi write burst| raw:: html

    <a href="https://godoc.org/github.com/ReconfigureIO/sdaccel/smi#WriteBurstUInt32" target="_blank">SMI write burst</a>

.. |smi read| raw:: html

   <a href="https://godoc.org/github.com/ReconfigureIO/sdaccel/smi#ReadUInt32" target="_blank">SMI read</a>
