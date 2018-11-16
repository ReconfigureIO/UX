.. _check-addition:

5 – Check and then simulate your code
-------------------------------------
Now the code is complete and we know it conforms to the Go language, let's check your FPGA code is compatible with the Reconfigure.io compiler. Make sure you are back in ``tutorials/addition-gaps`` and run ``reco check``. Any syntax errors will be flagged up here. All being well you should see::

  $ reco check
  $GOPATH/github.com/your-github-username/tutorials/addition-gaps/main.go checked successfully

.. sidebar:: Setting a project

    Project settings are saved locally so you only need to create and set a project once per location. Once set, all simulations, builds, graphs and deployments will be saved within the active project.

Next, once you have dealt with any errors that might have come up, use our hardware simulator to test how your code will run on the FPGA. First, create a project to work within and set it to be active::

  reco project create addition
  reco project set addition

Now you can start a simulation by running ``reco sim run test-addition``::

  $ reco sim run test-addition
  preparing simulation
  done
  archiving
  done
  uploading
  done
  running simulation

  status: QUEUED
  Waiting for Batch job to start
  status: STARTED
  Beginning log stream for simulation 74c620cf-8fe0-4500-8a6f-fac0fa03edc2
  ...
  3

.. admonition:: Getting in the queue

    Simulation should normally only take around 5 minutes but could be up to 30 minutes depending on what else is in the queue.

For more detailed descriptions of any error messages you might receive here, you can take a look at our troubleshooting section: :ref:`errors`.
