Scaling up your Reconfigure.io projects
=======================================

.. TODO::
    why?

MapReduce
---------
MapReduce is a framework for processing problems with the potential for parallelism across large datasets using a number of nodes. This usually means using large numbers of computers in a network cluster or spread out geographically in a grid, but in the context of Reconfigure.io, our nodes are individual elements of circuitry on the same FPGA, or in the future, across multiple FPGAs. Put simply, you write the functions required to process the data and MapReduce farms this out to multiple nodes to introduce a high degree of parallelism, speeding up throughput. You can read about our MapReduce framework |blog|. But, put simple, it's a way to generate parallelised FPGA code for your Reconfigure.io projects.

Installation
^^^^^^^^^^^^
To install, you will need our framework generator and the golang ``bundle`` tool. To install you can run the following commands::

  go get github.com/ReconfigureIO/reco-map-reduce/cmd/generate-framework
  go get golang.org/x/tools/cmd/bundle

Structure
^^^^^^^^^
Reconfigure.io projects using our MapReduce framework start out with a slightly different structure to standard projects:

.. TODO::
   Link to project structure

Rather than the usual ``main.go`` for the FPGA code, we have an ``input.go`` that contains the functions required in our FPGA code, and a ``reco.yml``, which contains the settings required by our framework so that it can generate your scaled-up FPGA code.

The first step towards generating the FPGA code is to create a ``mapreduce.go`` from your ``reco.yml``, which contains the parallelised framework in a function called ``Top``. To do this, run::

  generate-framework -output mapreduce.go

Then we bundle together the functions defined in ``input.go`` with the contents of ``mapreduce.go`` to get our ``main.go`` for the FPGA. To do this run::

  bundle -prefix “ “ -o main.go .

.. |blog| raw:: html

   <a href="https://medium.com/the-recon/scaling-up-your-reconfigure-io-applications-17f2dbc797fc" target="_blank">here</a>
