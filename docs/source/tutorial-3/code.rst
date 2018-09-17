5 – Let's write some code
--------------------------
To further explore these methods of passing data around, let's use our template to write a very simple program to pass one integer to the FPGA from the host and tell the FPGA to multiply this integer by 2 and pass it back to the host. **As we're passing a single integer, the host can pass this straight to the FPGA's control register but the route back from the FPGA to the CPU is always via the shared memory**. As we have done in previous tutorials, lets first look at a flow diagram for this example:

.. figure:: images/StructureDiagram1.svg
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

Now we can duplicate our template and rename it for this simple example::

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
    ├── reco.yml
    └── vendor
      └── ...

Let's work on the host CPU code first. Open ``multiply1/cmd/test-multiply1/main.go`` in your chosen editor. Have a go at editing the template host code to do what's needed for the single integer multiplication described above. Here are some pointers:

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

Test your code
^^^^^^^^^^^^^^^
Now you can test your code in your local Go environment. Make sure you're in the top directory of your project ``$GOPATH/src/github.com/<your-github-username>/tutorials/multiply1`` and run ``go test``. If all is well with your FPGA-side code you should see::

  $ go test
  PASS
  ok  	github.com/ReconfigureIO/tutorials/multiply1	0.007s

Next you can head over to your host code (``$GOPATH/src/github.com/<your-github-username>/tutorials/multiply1/cmd/test-multiply1/main.go``) and check it builds with the Go compiler by running ``go build``.

Check and simulate
^^^^^^^^^^^^^^^^^^^
Now we're going to use ``reco`` to check the code you have written is compatible with the Reconfigure.io compiler, and then we'll simulate your code. First, let's create a project to work within::

  reco project create multiply1
  reco project set multiply1

To type-check your code for compatibility with our compiler, make sure you're in the ``tutorials/multiply1`` directory and run ``reco check``. If everything is ok, you should see::

  $ reco check
  GOPATH/src/github.com/<your-github-username>/tutorials/multiply1/main.go checked successfully

Once you've addressed any errors here, you can simulate how your code will run on an FPGA::

  $ reco sim run test-multiply1
  (.....)
  The result from the FPGA is: 2

Once the simulation is complete, you should see the multiplication result displayed. When you're done, you can compare your code with ours, which you'll find here: ``tutorials/multiply1/``.

.. |binary| raw:: html

   <a href="https://golang.org/pkg/encoding/binary/" target="_blank">binary</a>

.. |log| raw:: html

   <a href="https://golang.org/pkg/log/" target="_blank">log</a>
