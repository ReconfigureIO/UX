13 – Check and simulate
-----------------------

.. sidebar:: Setting a project

    Project settings are saved locally so you only need to create and set a project once per location. Once set, all simulations, builds, graphs and deployments will be saved within the active project.

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
