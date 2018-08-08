A platform for software defined chips
=====================================
Reconfigure.io is a platform for programming hardware accelerators from software. You can use use your existing development tools to write applications in Go, so you can access the acceleration potential provided by FPGA chips – more performance, lower latency, and reduced power and space requirements. We have both cloud and on-premises platform options, so whatever your situation or use case, we have a platform that will work for you. Our software defined chips are fully reprogrammable and our tooling is works in line with modern software development practices – CI&CD, Agile etc. – so you can make changes to your designs in-line with how you currently work.

.. image:: images/platform-options.png
    :align: center
    :width: 100%

FPGA-based hardware acceleration, whilst nothing new, provides significant latency and throughput improvements through carrying out many, many tasks in parallel. Cost reductions are easily achieved because one FPGA can carry out the work of many servers. Up until now, the power of the FPGA has been tricky to harness due to the skills required to take full advantage of their programmability. Reconfigure.io allows you to use the skills and tools you already have to program and reprogram FPGAs to fit your business-specific requirements.

.. image:: images/speed-animation.gif
    :align: center
    :width: 80%

Where do I sign up?
-------------------
If you're new to Reconfigure.io and would like to try out our cloud platform for free, please |signup| using your Github account. It'll just take a few minutes and we'll guide you through downloading and :ref:`installing <install>` our command line tool. If you want to know more about our on-premises platform, please contact us at sales@reconfigure.io.

How to use this guide
----------------------
Reconfigure.io provides a comfortable platform for you to use your software development skills to create designs for hardware chips.

We've got some useful overviews of our :ref:`workflow` from coding to deployment and our :ref:`program_structure` to get you started. On the same page you'll find some details of our :ref:`system architecture` too. But if tutorials are more your thing:

* You can start off by running through our :ref:`first tutorial <demo>` to see how powerful the Reconfigure.io service is. Through this, you will get to grips with our simple workflow, you will use some of our example code to run through checking, simulating, building and finally deploying a program to an FPGA.
* Next, our :ref:`second tutorial <addition>` looks at a very simple example and guides you through completing some code for yourself to give you more experience of how our programs are structured.
* Our :ref:`third tutorial <structure>` looks at program structure in more detail, as well as exploring how data is shared between the various elements of the FPGA instance – This puts you in a good position to start writing your own programs.
* Our :ref:`fourth tutorial <graphstutorial>` guides you through optimizing your programs for the FPGA architecture using our graph generation feature.

We have two platform options: on-premises or cloud. Any information in these docs that is specific to a platform will be clearly indicated.

You can access technical support from our engineering team at any time, we're always available on the |forum| if you need us, or start a conversation using our in-app messenger on your |dashboard|.

Along the way, you may want to read a little more about a particular aspect of the Reconfigure.io service. For this, there is an :ref:`overview <overview>` section with clear descriptions of each stage of the workflow as well as details of system architecture to help you conceptualize what’s happening throughout the process.

.. |signup| raw:: html

   <a href="https://reconfigure.io/sign-up" target="_blank">sign up</a>

.. |forum| raw:: html

   <a href="https://community.reconfigure.io/" target="_blank">community forum</a>

.. |dashboard| raw: html

   <a href="https://app.reconfigure.io/dashboard" target="_blank">dashboard</a>
