.. _setup:

Getting Started – Let's Deploy Some Code!
=========================================
We're going to deploy a build of our MD5 hash example to a cloud FPGA and use it to generate MD5 hashes of strings of your choice. If you would like to look at our code, you can do so `here <https://github.com/ReconfigureIO/web-md5>`_.

If you've found your way here without signing up first, please head to our `website <http://reconfigure.io/sign-up>`_.

1. Open a terminal and enter the command below to deploy a build of our MD5 code example to an FPGA. We've set a time limit of 30 minutes for the deployment to avoid using up your available hours if you forget to stop it at the end. If you have problems running this command you may need to :ref:`update to the latest version of our command line tool <install>`.

  .. parsed-literal::

     reco deploy run |web_md5_uuid| timeout 30m run-webserver --wait=http

  And you should see:

  .. code-block:: shell

     2018-01-08 16:17:24| creating deployment
     2018-01-08 16:17:24| creating deployment
     2018-01-08 16:17:25| done. Deployment ID: <deploy_ID>
     2018-01-08 16:17:25| you can run "reco deployment log <deploy_ID>" to manually stream logs
     2018-01-08 16:17:26| status: SUBMITTED
     2018-01-08 16:17:26| Waiting for Spot Instance Request to be created
     2018-01-08 16:17:46| status: QUEUED
     2018-01-08 16:17:46| Waiting for EC2 instance to be allocated
     2018-01-08 16:17:46| Waiting for EC2 instance to be allocated
     2018-01-08 16:26:14| status: STARTED
     2018-01-08 16:26:24| Waiting for deployment to listen on port 80
     2018-01-08 16:27:05| Deployment ready at <deployment_IP>
     <deploy_ID>

2. Connect to the deployment using the command below, but substituting <deploy_ID> for your unique deployment ID:

   .. code-block:: shell

       reco deploy connect <deploy_ID>

   The MD5 generator will open in your default browser. You can enter some text in the box on the left hand side and click GENERATE to see the MD5 hash straight from the FPGA!

   .. image:: MD5_mockup.png
      :align: center

4. Remember to stop your deployment by running the following command using your unique deployment ID:

   .. code-block:: shell

      reco deploy stop <deploy_ID>

**Now visit your** |dashboard| **to view your account.**

.. |dashboard| raw:: html

   <a href="https://app.reconfigure.io/dashboard" target="_blank">dashboard</a>
