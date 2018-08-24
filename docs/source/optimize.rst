Optimizing your projects
=========================

Build reports
-------------
Once a build image is complete you can access a build report to find out how much of the FPGA's available resources your design is using. In this section we'll cover the following:

* How to view reports
* The structure of reports – highlighting key useful elements
* A look at what each component of the FPGA is for

View a build reports
^^^^^^^^^^^^^^^^^^^^
Build reports are generated when a build image completes successfully. The information included in build reports is broken down into the various elements that make up the FPGA: Configurable logic blocks (LUTs and Registers), DSP blocks, and RAM.

To view a build report, find the build ID you're interested in, either by checking your recent activity on your |Dashboard| or by viewing the build list for your project: prom the project location on your local machine enter::

  reco build list

Then to view a report, copy a build ID and run::

  reco build report <build_ID>

Report structure
^^^^^^^^^^^^^^^^
Here's an example report from our Histogram-array example:

.. code-block:: shell
  :linenos:
  :emphasize-lines: 76, 77, 78, 79, 80

  Build Report: {
    "partName": "xcvu9p-flgb2104-2-i",
    "lutSummary": {
      "used": 5769,
      "detail": {
        "lutLogic": {
          "used": 5272,
          "available": 1182240,
          "description": "LUT as Logic",
          "utilisation": 0.45
        },
        "lutMemory": {
          "used": 497,
          "available": 591840,
          "description": "LUT as Memory",
          "utilisation": 0.08
        }
      },
      "available": 1182240,
      "description": "CLB LUTs",
      "utilisation": 0.49
    },
    "moduleName": "reconfigure_io_sdaccel_builder_stub_0_1",
    "regSummary": {
      "used": 12752,
      "detail": {
        "regLatch": {
          "used": 0,
          "available": 2364480,
          "description": "Register as Latch",
          "utilisation": 0
        },
        "regFlipFlop": {
          "used": 12752,
          "available": 2364480,
          "description": "Register as Flip Flop",
          "utilisation": 0.54
        }
      },
      "available": 2364480,
      "description": "CLB Registers",
      "utilisation": 0.54
    },
    "blockRamSummary": {
      "used": 17,
      "detail": {
        "blockRamB18": {
          "used": 32,
          "available": 4320,
          "description": "RAMB18",
          "utilisation": 0.74
        },
        "blockRamB36": {
          "used": 1,
          "available": 2160,
          "description": "RAMB36/FIFO",
          "utilisation": 0.05
        }
      },
      "available": 2160,
      "description": "Block RAM Tile",
      "utilisation": 0.79
    },
    "dspBlockSummary": {
      "used": 0,
      "available": 6840,
      "description": "DSPs",
      "utilisation": 0
    },
    "ultraRamSummary": {
      "used": 0,
      "available": 960,
      "description": "URAM",
      "utilisation": 0
    },
    "weightedAverage": {
      "used": 40180,
      "available": 9067200,
      "description": "Weighted Average",
      "utilisation": 0.44
    }
  }

We advise optimizing your designs for low overall utilization. Keeping your designs compact means they build faster, and there's more scope to scale them up in future. When thinking about optimizing in this way, the **Weighted Average** score highlighted at the bottom of the report is the most useful at first glance. You can see this design is small, which you would expect as it's simple, and is using up only 0.44% of the FPGA's available resources.

FPGA structure
^^^^^^^^^^^^^^
When looking at build reports for ideas on how to optimise your code, it's useful to have a high level overview of how the FPGA chip is made up.

* **CLBs (configurable logic blocks)** are the basic building blocks of the FPGA. They contain:
  * **LUTs (look up tables)**, which implement the logic required by your design
  * Registers, which can be configured as latches or flipflops to store data
* Block RAM components are used for on-chip data storage. Arrays that exceed 512 bits are stored in block RAM, whereas under that figure, registers are used.
* DSP blocks provide various often-used functions, and can be used instead of recreating that functionality with CLBs to reduce area usage, latency and power requirements. You don't need to worry about this, our service optimises your code to use DSP blocks when appropriate.
* Ultra RAM may be used for very large channel/RAM capacities required by your projects.

.. |Dashboard| raw:: html

   <a href="https://app.reconfigure.io/dashboard" target="_blank">dashboard</a>
