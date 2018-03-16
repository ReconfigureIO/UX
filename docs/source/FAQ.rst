Frequently Asked Questions
==============================================
:ref:`one`

:ref:`two`

:ref:`three`

:ref:`four`

:ref:`five`

:ref:`six`

:ref:`seven`

:ref:`eight`

:ref:`nine`

:ref:`ten`

.. :ref:`eleven`

.. _one:

How do I sign up for an account?
--------------------------------
Visit us |signup| to sign up. We'll ask you a few introductory questions and then send you an invite email with a link to create your account. Then you can get all set up by following our :ref:`getting started <setup>` guide.

.. _two:

How much does it cost to use Reconfigure.io?
--------------------------------------------
We have a couple of plans depending on the scale of your organization. Check out our |pricing| for more details. Alternatively, if your work is open source, with a license, then our service is free to use.

.. _three:

What skills do I need to use Reconfigure.io?
--------------------------------------------
To use our service, all you need is a computer. All processing work is done in the cloud. We have designed our tooling and workflow to be really easy to use. All the code you'll write will be in Go. If you're not familiar with using Go, there are some great resources |go|. Our command line tool will feel familiar, and our libraries and examples are all available as github repositories.

We provide a series of tutorials, starting with getting your account up and running, then onto our workflow, and then we introduce code templates to help you start to create simple programs yourself. |concurrency| is important because our aim is to help you speed up your applications by taking advantage of the |parallel| capabilities of FPGAs, so we touch on this throughout our tutorials too.

We have a great |forum| where the team are always available to help, and you can share experiences with other users. We provide support through the forum with optimizing your code too.

.. _four:

What is an FPGA? And why would I want to use one?
-------------------------------------------------
FPGAs are basically reprogrammable circuitry on a chip. They've been in-use since the mid-80s and were originally designed for developing new hardware, allowing new chip designs to be simulated to ensure they worked.

FPGAs are now of increasing interest to software engineers due to their ability to efficiently process large amounts of data. They are one way to supercharge computational performance. FPGAs are programmable like GPUs or CPUs but are aimed at parallel, low-latency, high-throughput problems like inference and Deep Neural Networks.

.. _five:

Can I use Reconfigure.io to program my own FPGA?
------------------------------------------------
Currently, our service provides access to FPGAs using |f1|. However, we have big plans for the future, so keep an eye on our |roadmap| to see what we'll be developing in the coming months. You can always let us know on the |wishlist| if there's anything you would like us to support.

.. _six:

Do I need an AWS F1 account?
-----------------------------
No, we handle the instances for you. All you need is a computer, a Reconfigure.io account and our ``reco`` command line tool.

.. _seven:

How do I report a bug?
----------------------
At the moment we're handling all bug reporting through our |bug|. To report a bug, just start a new topic and tell us as much as possible about it. We will investigate and get back to you with a fix.

.. _eight:

Can I use my own Go packages in my Reconfigure.io programs?
-----------------------------------------------------------
You can! Checkout our |packages| to creating your own packages specifically for FPGAs.

.. _nine:

Can I benchmark my code?
------------------------
Yes, we use Go's built-in benchmarking support for this. Follow our |benchmark| to find out how.

.. _ten:

How do I go about setting up Go on my local machine?
---------------------------------------------------------------------
|install| has all the instructions you need to set up your own Go development environment. It leads you on to some basic tutorials for learning Go too, which are really useful if you are just starting out.

.. .. _eleven:
.. Can I simulate my programs on my local machine?
.. ------------------------------------------------

.. |signup| raw:: html

   <a href="https://reconfigure.io/sign-up" target="_blank">here</a>

.. |pricing| raw:: html

   <a href="https://reconfigure.io/pricing" target="_blank">pricing options</a>

.. |go| raw:: html

   <a href="https://tour.golang.org/welcome/1" target="_blank">online</a>

.. |concurrency| raw:: html

   <a href="https://www.golang-book.com/books/intro/10" target="_blank">Concurrency</a>

.. |parallel| raw:: html

  <a href="https://blog.golang.org/concurrency-is-not-parallelism" target="_blank">parallel</a>

.. |forum| raw:: html

   <a href="http//community.reconfigure.io" target="_blank">community forum</a>

.. |f1| raw:: html

   <a href="https://aws.amazon.com/ec2/instance-types/f1/" target="_blank">AWS F1 Instances</a>

.. |roadmap| raw:: html

   <a href="https://trello.com/b/Gv9qKdED/reconfigureio-roadmap" target="_blank">roadmap</a>

.. |wishlist| raw:: html

   <a href="https://community.reconfigure.io/c/suggestions" target="_blank">forum</a>

.. |bug| raw:: html

   <a href="https://community.reconfigure.io/c/report-a-bug" target="_blank">forum</a>

.. |packages| raw:: html

   <a href="https://medium.com/the-recon/write-your-first-go-package-for-fgpas-a29cd0af1916" target="_blank">guide</a>

.. |benchmark| raw:: html

   <a href="https://medium.com/the-recon/benchmarking-go-code-running-on-fpgas-ce9d97a62917" target="_blank">guide</a>

.. |install| raw:: html

   <a href="https://golang.org/doc/install" target="_blank">This page</a>
