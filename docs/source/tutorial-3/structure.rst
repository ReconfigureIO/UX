.. _structure-tutorial:

1 – Program Structure
----------------------
Reconfigure.io programs all have the same structure, a main.go file for the FPGA and then a ``cmd`` directory containing the code for the CPU. We call the host code a **command** and you can have multiple host commands within the same program. When you come to simulate or deploy a build image you can choose which host command to use by using the name of the directory it sits within, for example, to simulate the program below, running the benchmarking command, you would navigate to the ``My-Program`` directory and run ``reco sim run bench-My-Program``. ``reco.yml`` contains a few simple settings for memory access, you just need to specify how many read and write ports you need from the FPGA to shared memory::

  My-Program
  ├── cmd
  │   └── test-My-Program
  │       └── main.go
  ├── main.go
  ├── main_test.go
  ├── reco.yml

Next, we'll look at the structure of the two ``main.go`` files.
