.. _overview:

How it works
=============================
This section gives an overview of our service. We'll start by running through our workflow and tooling, and then take a look at our system architecture and the steps we go through to get your code into a suitable format for programming an FPGA instance.

If you prefer to just get stuck in, you can jump straight to our :ref:`tutorials <demo>`, or watch a video run-through |video|.

Reconfigure.io is a platform as a service (PaaS), which takes Go code, compiles and optimizes it, and deploys to cloud-based FPGAs. You will code in Go and interact with the service using our simple command-line tool. We use AWS F1 instances for our cloud FPGAs, but all you need to use our service is a Reconfigure.io account and our command-line tool – we take care of the rest.

Workflow and tooling
--------------------

The ``reco`` tool
^^^^^^^^^^^^^^
All access to the Reconfigure.io service is through our tool – ``reco``. Use ``reco`` to upload and simulate your code, manage builds and deploy to a remote FPGA. If you need to install or update ``reco`` you can find instructions :ref:`here <install>`.

``reco`` is a simple tool with several intuitive commands, we'll look at some of these in the relevant sections below – commands are described in bullet points. For a full list see, :ref:`tool`.

Now, let's take a look at the workflow, from coding to deployment:

Code
^^^^^
All the code you write will be in Go. You can create projects in your Go workspace and edit with your favourite editor. A Reconfigure.io project is made up of two Go programs, one for the FPGA and one for the host CPU. We use a :ref:`subset of the Go language <gosupport>` for FPGA-side code and any new additions to the scope will be flagged up in our :ref:`Release_Notes`. Host-side code is written in standard Go.

Go tooling
^^^^^^^^^^^
Your Reconfigure.io projects are developed in your Go environment so you can use standard Go tooling throughout the process: ``go build`` and ``go test`` can be used to flag up any semantic or syntactic errors and run tests against your FPGA code. You can read more about the Go testing framework |go_test|. You can also |benchmark| your designs using the Go testing framework, the benchmark is written into your program and then run during deployment to get an accurate measurement from the process running on hardware.

Check
^^^^^
Once you are happy with your code you can perform a quick-check to make sure it's compatible with our compiler. If your code contains any errors, or you've used elements of Go that are out of scope for FPGA-side code, that will be flagged up during this check.

* ``reco check`` locally type checks your FPGA code.

Simulate
^^^^^^^^^
Next you can simulate how your program will run on hardware. Any errors will be highlighted here and it's considerably quicker than creating a build, minutes rather than hours, so will save you time during the development process. Simulations will :ref:`timeout <timeout>` if they don't complete within one hour.

*  ``reco sim run <my_cmd>`` simulates how your program would run on an FPGA.

.. _graph:

Graph
^^^^^
Our compiler takes your Go code through several stages to get it into a format suitable for programming an FPGA instance. First, it's translated into a language called Teak, then, using the Teak output we can generate dataflow graphs. Using the ``graph`` command you can generate a dataflow graph for your program at any time, allowing you to analyze and optimize its performance.

.. note::
    The ability to generate graphs is a temporary feature. Due to the complexity of the output we suggest you share your graphs with us on our |forum| so our engineers can assist you in optimizing your code.

*  ``reco graph gen`` generates a dataflow graph from the program in your current directory.
*  ``reco graph list`` lists all graphs in your project along with their unique IDs.
*  ``reco graph open <graph_ID>`` lets you view any graph in your default default PDF viewer.

Build
^^^^^^^^
Next, you can build your project. Our compiler will check compatibility and convert your code into an image suitable for deploying to an FPGA instance. Builds will :ref:`timeout <timeout>` if they don't complete within 12 hours.

.. admonition:: Build Times

   Build times are currently in the region of 4 hours. This is longer than we would like and is partly due to underlying silicon vender tools, which we are currently working to address. Although the build time is relatively long, it is not something you will have to do very often during your program development - you will mostly use our hardware simulator, which takes minutes rather than hours.

*  ``reco build run`` uploads the code from your current directory to the Reconfigure.io service. Building will automatically start once the upload has completed. Your Go code will be compiled and optimized to run on an FPGA instance. It's a good idea to add a message to your build, just as you would with a git commit, so you can remember what it's for later. To do this, use the ``-m`` or ``--message`` flag followed by your short message, like this: ``reco build run -m "my helpful message"``.
*  ``reco build list`` lists all builds for the current project along with their statuses. Each build is date-stamped and given a unique ID, and you can see any messages you have included so you can always make sure you're using the correct build when working on large and complex projects.

Deploy
^^^^^^
Once your build is complete you can deploy the image to an FPGA instance. This programs the FPGA with your compiled and optimized code and runs your chosen host-side command on the CPU.

*  ``reco deploy run <build_ID> <cmd>`` will deploy your build to the FPGA and run your chosen command on the host CPU.
* If your deployment is designed to run indefinitely, it is important to remember to stop it – live deployments are charged to your account (open-source users get 20 hours/month for free). Run ``reco deployment stop <deployment-ID>`` to stop a deployment. It is also good practice to include a timeout, just in case you forget to stop a deployment. To do this you can run ``reco deployment run <build-ID> timeout 30m <cmd>`` to ensure that the deployment runs for 30 minutes max. You can set whatever timeout you want, using hours ``1h``, minutes ``1m`` and seconds ``1s``.

Project structure
------------------
Reconfigure.io **programs** have a simple structure: code for the FPGA and code for the host CPU. Both are written in Go:

.. image::  ProgramStructure.png

When using ``reco`` to simulate, build and deploy your programs, you will work within a **project**. You can list items per project, which is really useful when you've got several work streams going at the same time, each with several builds and deployments.

.. note::

    You should create a new project for each program you work on. If you run a ``sim``, ``build`` or ``deploy`` without setting which project to use first, you will be prompted to run ``reco set-project <project name>`` before continuing. If it's a new program you are working on you will need to run ``reco create-project`` followed by a new project name.

* ``create-project`` is used to create a new project
* ``projects`` displays a list of all active projects for your account
* ``set-project`` sets a project to use for the program code you're currently working on

.. image::  ProjectsStructure.png

System architecture
--------------------
The image below describes how Reconfigure.io works. All coding is done locally in Go and you can develop and debug your projects in your Go environment before using our tools to simulate, build and deploy to FPGAs in the cloud. F1 instances include a host CPU with an FPGA connected via PCIe.

.. image:: ReconfigureArchAWS.png

Each FPGA card has 64 GiB dedicated memory (DRAM) which can be used to share data between the CPU and FPGA. The host CPU can allocate blocks in shared memory and pass pointers to the FPGA, and the FPGA can read and write to and from those pointers. The FPGA also has on-chip block RAM, which it can allocate directly.

.. image:: ReconfigureFPGAarchitecture.png

A note about memory access – AXI / SMI
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^space
Our current standard way of having the FPGA talk to shared memory is using the AXI protocol (find more on this in our :ref:`third tutorial <structure>`). AXI is designed to work with multicore CPUs, with several cores accessing memory at the same time. But for us, as we're using Go for FPGAs, the level of parallelism is so much higher. We're dealing with many, potentially thousands of go routines trying to access memory at the same time. Managing this with AXI is not straightforward.

**Our engineers have developed a new protocol – SMI (Scalable Multiprotocol Infrastructure) – which addresses the issue of fine-grained parallelism, as well as simplifying code and reducing boilerplate for our users.** It's available for testing from Reconfigure.io v0.17.0 onwards and will be fully rolled out as our standard method for accessing memory very soon.

For more information, please see our |smi_blog| and you can check out our |examples| – we've included a version of our histogram-array code that uses SMI rather than AXI. We've also included an SMI-ready version of our `template <https://github.com/ReconfigureIO/tutorials/tree/master/template-SMI>`_ so you can start playing around with your own applications.

You will notice that with SMI we have introduced a ``reco.yml`` file per program. This contains some simple settings: Infrastructure (SMI or AXI), the memory access bandwidth (max 512 bit, min 64 bit) and the number of ports you require for your application. So, for a program using SMI, with one read and one write port, the settings should appear like this:

.. code-block:: shell

    memory_interface: smi
    memory_width: 512
    ports: 2

Go compilation stages
^^^^^^^^^^^^^^^^^^^^^
Your Reconfigure.io projects will be coded using :ref:`our subset <gosupport>` of the standard Go language, using our :ref:`coding style-guide <style>` to help get the most out of the destination hardware.

We take your code through several stages to get it ready to program an FPGA:

* **Teak** – first, your Go is translated into |teak|, a data-flow language with its roots in research from the University of Manchester. This allows us (and you, using :ref:`graphs <graph>`) to optimize your code for the FPGA architecture.
* **Verilog RTL representation** - this 'register transfer level' description is suitable for taking your code into the traditional FPGA development process.
* **Verilog netlist** - we then use standard tooling to compile your code into a netlist which relates to the FPGA's logic components.
* **Place and route** – this is where we decide where on the physical FPGA chip to place the components from the netlist.
* **Bitstream** - the last part of the process is using the place and route output to generate a bitstream capable of programming the FPGA.

CPU vs FPGA
^^^^^^^^^^^^
The Go language is designed for writing concurrent programs, which you can read more about |why_go|. Go is normally used to write for traditional CPUs, where the concurrency in programs using goroutines, channels and select statements can take advantage of multi-core CPUs to perform several operations in parallel. But, when we optimize your Go for an FPGA, this potential for parallel processing is drastically increased.

For example, a goroutine running on a CPU is a tiny light-weight thread running within a bigger thread, with just one big thread per CPU core. There is potential for parallelism here, but only one operation can happen per core per unit of time. On an FPGA, one go routine translates to a small chunk of circuit, continuously running, so you could create a million of them and they can all do their work all the time.

.. |smi_blog| raw:: html

   <a href="https://medium.com/the-recon/introducing-smi-7a216e2dff45" target="_blank">blog post</a>

.. |examples| raw:: html

   <a href="https://github.com/ReconfigureIO/examples" target="_blank">examples</a>

.. |teak| raw:: html

   <a href="http://apt.cs.manchester.ac.uk/projects/teak/" target="_blank">Teak</a>

.. |why_go| raw:: html

   <a href="https://medium.com/the-recon/why-do-we-use-go-511b34c2aed" target="_blank">here</a>

.. |go_test| raw:: html

   <a href="https://golang.org/doc/code.html#Testing" target="_blank">here</a>

.. |video| raw:: html

   <a href="https://youtu.be/yIHToaGI4_M" target="_blank">here</a>

.. |benchmark| raw:: html

   <a href="https://medium.com/the-recon/benchmarking-go-code-running-on-fpgas-ce9d97a62917" target="_blank">benchmark</a>

.. |forum| raw:: html

   <a href="https://community.reconfigure.io/c/optimization-support" target="_blank">forum</a>
