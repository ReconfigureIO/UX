.. _setup:

Getting Started – Let's Deploy Some Code!
=========================================
We're going to deploy a build of our MD5 hash example to a cloud FPGA and use it to generate MD5 hashes of strings of your choice. If you would like to look at our code, you can do so |md5_code|.

If you've found your way here without signing up first, please head to our `website <http://reconfigure.io/sign-up>`_.

1. Open a terminal and enter the command below to deploy a build of our MD5 code example to an FPGA. We've set a time limit of 30 minutes for the deployment to avoid using up your available hours if you forget to stop it at the end. If you have problems running this command you may need to :ref:`update to the latest version of our command line tool <install>`.

  .. subst-code-block:: shell

     reco deploy run |web_md5_uuid| timeout 30m run-webserver --wait=http

  And you should see:

  .. code-block:: shell

     creating deployment
     done. Deployment ID: <deployment_ID>
     you can run "reco deployment log <deployment_ID>" to manually stream logs
     status: SUBMITTED
     Waiting for Spot Instance Request to be created
     status: QUEUED
     Waiting for EC2 instance to be allocated
     Waiting for EC2 instance to be allocated
     status: STARTED
     Waiting for deployment to listen on port 80
     Deployment ready at <deployment_IP>
     <deployment_ID>

2. Connect to the deployment using the command below, but substituting <deployment_ID> for your unique deployment ID:

   .. code-block:: shell

       reco deploy connect <deployment_ID>

   The MD5 generator will open in your default browser. You can enter some text in the box on the left hand side and click GENERATE to see the MD5 hash straight from the FPGA!

   .. image:: MD5_mockup.png
      :align: center

4. Remember to stop your deployment by running the following command using your unique deployment ID:

   .. code-block:: shell

      reco deploy stop <deployment_ID>

**Now visit your** |dashboard| **to view your account.**

.. |md5_code| raw:: html

   <a href="https://github.com/ReconfigureIO/web-md5" target="_blank">here</a>

.. |dashboard| raw:: html

   <a href="https://app.reconfigure.io/dashboard" target="_blank">dashboard</a>
