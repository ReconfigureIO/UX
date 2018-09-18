9 – Check and simulate
-----------------------
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
