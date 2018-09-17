6 – More data
--------------
In that last example, as we only needed to pass a single argument from host to FPGA, we sent it straight to the FPGA's control register. This time, we're going to pass an array, so we'll send it via shared memory.

.. figure:: images/StructureDiagram2.svg
    :width: 90%
    :align: center

You can use the code you created above as the basis for this new example and just make the changes required to pass more data. So, duplicate the ``multiply1`` directory and rename it to ``multiply-array``::

  cp -r multiply1 multiply-array
  cd multiply-array/cmd
  mv test test-multiply-array

You should have something like this::

  multiply-array
  ├── README.md
  ├── cmd
  │   └── test-multiply-array
  │       └── main.go
  ├── glide.yaml
  ├── main.go
  ├── main_test.go
  ├── reco.yml
  └── vendor
    └── ...

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

Test your code
^^^^^^^^^^^^^^^
As you have used the same multiplication function as you used for the previous example, you can use the same test file to test your code too. So let's do that next. Make sure you're in the top directory of your project ``$GOPATH/src/github.com/<your-github-username>/tutorials/multiply-array`` and run ``go test``. If all is well you should see::

  $ go test
  PASS
  ok  	github.com/ReconfigureIO/tutorials/multiply-array	0.007s

Next head to the host-side code (``tutorials/multiply-array/cmd/test-multiply-array``) and check the code with the Go compiler by running ``go build``.

Check and simulate
^^^^^^^^^^^^^^^^^^^
Now we're moving over to the Reconfigure.io tooling we need to create a project for this example, let's call it ``multiplyArray``::

  reco project create multiplyArray
  reco project set multiplyArray

You can now type-check your code for compatibility with our compiler. From the ``multiply-array`` directory enter ``reco check``, and hopefully you'll see::

  $ reco check
  GOPATH/src/github.com/<your-github-username>/tutorials/multiply1/main.go checked successfully

Once you've addressed any errors here you can simulate how your code will run on an FPGA::

  $ reco sim run test-multiply-array
  (.....)
  The result from the FPGA is: 024681012141618

Once the simulation is complete, you should see the contents of the result array. Once you're done, you can compare your code with ours, which you'll find here: ``tutorials/multiply-array/``.

What have we done
^^^^^^^^^^^^^^^^^
In this tutorial we have looked at how to structure your code to work with Reconfigure.io, and how to use our template as a basis for writing new programs. Also, we've seen how to pass arguments straight from the host to the FPGA using the control register, and pass data from the host to the FPGA via shared memory, and back again. Next, we'll look at a few ways to :ref:`optimize <optimize>` your Reconfigure.io programs.

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

.. |tests| raw:: html

  <a href="https://golang.org/pkg/testing/" target="_blank">here</a>

.. |smi read burst| raw:: html

   <a href="https://godoc.org/github.com/ReconfigureIO/sdaccel/smi#ReadBurstUInt32" target="_blank">SMI read burst</a>

.. |smi write burst| raw:: html

    <a href="https://godoc.org/github.com/ReconfigureIO/sdaccel/smi#WriteBurstUInt32" target="_blank">SMI write burst</a>

.. |smi write| raw:: html

    <a href="https://godoc.org/github.com/ReconfigureIO/sdaccel/smi#WriteUInt32" target="_blank">SMI write</a>

.. |smi read| raw:: html

   <a href="https://godoc.org/github.com/ReconfigureIO/sdaccel/smi#ReadUInt32" target="_blank">SMI read</a>
