7 – Let's write the code
-------------------------
Let's work on the host CPU code first. Open ``multiply1/cmd/test-multiply1/main.go`` in your chosen editor. Have a go at editing the template host code to do what's needed for the single integer multiplication we just looked at. Here are some pointers:

* We're only passing one integer straight to the FPGA's control register so we only need to make space in shared memory for the result from the FPGA, not the data we're sending *to* the FPGA.
* We only need to send two arguments to the FPGA: the integer to be used in the multiplication and the pointer to where we want the FPGA to store the result.
* Use the Go package |binary| to read the result back from shared memory and store it into a variable ready to print.
* Use the Go package |log| to print your result!

Now, open ``multiply1/main.go`` and write the FPGA code to complete the simple multiplication. Here are some pointers:

* Just two inputs to the FPGA need specifying, the integer to be multiplied and the pointer to where we're going to store the result.
* We just need one smi write port as we won't be reading anything from shared memory – remember to change the number of ports in the ``reco.yml`` file to ``1``.
* All that's left is to do the multiplication. Create a simple 'multilply by 2' function *outside* the ``Top`` function, call it ``Multiply``. You can call your ``Multiply`` function from within ``Top``. This may seem a bit of a complex way to multiply by 2 but it will allow us to test the code in our local Go environment later. Then use the |smi write| package to write the result to the correct location in shared memory so it can be picked up by the host.

Next you need to write a test file so you can test this code in your Go environment. There is some information on creating a test suite |tests|, and a stripped-back ``main_test.go`` file is included in our template. You just need to edit the template test file (``multiply1/main_test.go``) to check that the ``Multiply`` function you created in your FPGA code above actually multiplies its input by 2.

Once you're happy with your code, let's commit those changes and push them to your ``multiply`` branch on github. First make sure you're in ``tutorials/multiply1`` and then run::

  git add main.go && cmd/test-multiply1/main.go
  git commit -m "multiply1 completed"
  git push origin multiply

.. |binary| raw:: html

   <a href="https://golang.org/pkg/encoding/binary/" target="_blank">binary</a>

.. |log| raw:: html

   <a href="https://golang.org/pkg/log/" target="_blank">log</a>
