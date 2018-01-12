What is Reconfigure.io?
========================
Reconfigure.io lets you program FPGAs with Go. We offer a powerful, easy to use service that provides access to the hardware acceleration power of FPGAs combined with the convenience of cloud-based management. Low-latency and concurrency are necessary to handle the massive data-sets associated with many industries and we enable you to build and deploy your project-specific applications, coded entirely in Go, to cloud-based FPGAs.

.. image:: PlatformAnimation.gif

Reconfigure.io is for ...
-------------------------

Software Developers
^^^^^^^^^^^^^^^^^^^
With Reconfigure.io you can develop concurrent, project-specific applications in Go, and use our service to build and deploy to cloud FPGAs, all with no hardware design skills or experience. Performance improvements have long been achieved using faster CPUs and multi-core processing. However, big data associated with AI, Finance, IoT, media etc. requires something beyond what traditional CPUs can deliver. We believe low-latency and concurrency, through the use of FPGAs, is the answer.

Hardware Engineers
^^^^^^^^^^^^^^^^^^
Creating project-specific hardware applications using traditional tools involves the time-consuming process of generating large amounts of low-level code. With Reconfigure.io you can take advantage of the easy to use high-level Go language to program and reprogram FPGAs in the cloud using our simple command-line tooling and cloud management system.

Systems Architects
^^^^^^^^^^^^^^^^^^
If you need to speed up data handling and analytics for your business, your existing software development team can use Reconfigure.io to create concurrent programs to fit your specific requirements. These applications will use the convenience and parallel capabilities of cloud FPGAs to drastically increase data through-put while minimizing latency.

Hobbyists
^^^^^^^^^
We provide the most cost-effective way to program FPGAs. You don't need to invest in any hardware, and if your project is open source, with a valid license, you'll get 20 hours runtime per month for free. Just use our development workflow to write your programs and away you Go!

Why FPGA? and why Reconfigure.io?
---------------------------------
Performance
^^^^^^^^^^^
FPGAs provide significant speed enhancements (10–100x) over the same code running on traditional CPUs. While FPGAs run at a slow speed relative to modern CPUs, they complete many, many tasks at the same time resulting in a dramatic overall speed increase.

Cost
^^^^
FPGAs allow you to increase speed while reducing hardware requirements, which leads to cost savings. Hardware consolidation is made possible because one FPGA can simultaneously perform the tasks of many servers.

Parallelism
^^^^^^^^^^^
The flexibility and configurability of the FPGA gives you a cost-effective opportunity to bring high-powered parallel computing to your specific application.

Reprogrammability
^^^^^^^^^^^^^^^^^
Once up and running your bespoke program can be altered at any time in line with your business's changing requirements.

Cloud Management
^^^^^^^^^^^^^^^^
Reconfigure.io’s build and deployment service is accessible entirely within the cloud.

Familiar tooling
^^^^^^^^^^^^^^^^
Use a streamlined subset of the Go language to program remote FPGA hardware accelerators in a familiar cloud-based build/deployment environment. There is no requirement to learn an HDL to use our FPGAs.

Why use Go?
-----------
The Go language has a number of features that are ideally suited to writing code in which many functions run in parallel:

* **Goroutines** are functions that can run concurrently with other functions.
* **Channels** are pipelines through which Goroutines can communicate and synchronize their operation.
* **Select** statements help organize the process of switching between channels and give programmers the ability to control when parallel operations can run.

For more on these features, take a look at :ref:`concurrency`.
