.. _release_notes:

=============
Release Notes
=============

Reconfigure.io v0.17.6
======================

This is a bugfix release focussed on enabling some in-house product tests.

bugfixes
^^^^^^^^
* If a vendored version of our `xcl <https://godoc.org/github.com/ReconfigureIO/sdaccel/xcl>`_ is provided, this is now given priority over our host-side code.
* The default `xcl <https://godoc.org/github.com/ReconfigureIO/sdaccel/xcl>`_ library has been updated to include fixes for a segfault and to allow memory proceed to run while a kernel is running.

Reconfigure.io v0.17.5
======================

This is a bugfix release focussed on fixing unintended side-effects of some recent compiler optimizations.

Bugfixes
~~~~~~~~~~~

* Fixed an edge case in our latch scheduling algorithm where many serial forks would not introduce a latch, causing timing to fail. Thanks to `foolmarks <https://community.reconfigure.io/u/foolmarks/summary>`_ on our forums for reporting the bug!
* Refined an optimization rule to prevent it from removing necessary control flow.

Reconfigure.io v0.17.4
======================

This release delivers significant performance improvements through simplifying logic and the way we handle constants. The result is faster and smaller arithmetic and logic operations, improved latch removal, and the ability to have multiple operators per clock cycle.

Features
~~~~~~~~~~~

* Simplified adjacent constants – two constants that are joined together will now be a single constant.
* Changes to priorities for latch removal in order to remove more.
* An entirely new cost system for latch removal based upon FPGA timing delay, along with reworked operators that allow them to complete in partial cycles, allowing simple arithmetic like ``(a + 1) < b`` to happen in a single cycle.

Reconfigure.io v0.17.3
======================

This is a performance focused release that includes some bugfixes related to larger applications

Features
~~~~~~~~~~~

* Reworked multipliers to use fewer pipeline stages, improving performance
* Optimize control flow around some channel operations
* Optimize expressions like n < 0 to just check the sign bit.

Bugfixes
~~~~~~~~~~~

* Fix an issue with some module names being too long for Vivado
* Fix an issue where reco.yml files using Windows line ending were not being parsed correctly

Reconfigure.io v0.17.2
======================

This is a bugfix release focussed on graph generation.

Bugfixes
~~~~~~~~~~~
* Fixed a bug in our optimization rules which lead to some graphs being incorrectly generated.

Reconfigure.io v0.17.1
======================

This release adds support for increased memory access bandwidth, from 64 bit to 512 bit, when using the new SMI infrastructure. This will provide a performance gain when using read/write burst memory transactions. See an example application using SMI `here <https://github.com/ReconfigureIO/examples/tree/master/histogram-array-SMI>`_.

API docs
~~~~~~~~~

A draft version of our SMI API docs is now available.

* `SMI docs <https://godoc.org/github.com/ReconfigureIO/sdaccel/smi>`_

Features
~~~~~~~~

* You can now set memory read/write bandwidth to 512 bit.

Reconfigure.io v0.17.0
======================

This release adds initial support for our new memory infrastructure, called SMI (Scalable Multiprotocol Infrastructure).

SMI
~~~

Our engineers have developed SMI to provide improvements to the way we give memory access to FPGAs. Improvements through using SMI include:

* Easier to scale up projects to use available memory bandwidth.
* Increase in available bandwidth across multiple goroutines.
* Simplified code, less boilerplate.

Features
~~~~~~~~

* Further optimize some variable and channel concurrency operations.
* Reduce verbose log output during synthesis.

Reconfigure.io v0.16.4
======================

This is a minor release focused on improving performance for generated code, and fixing a bug in our `sdaccel <https://github.com/ReconfigureIO/sdaccel>`_ support.

Features
~~~~~~~~

* Reduce the cost of functions calls.
* Optimize some variable and channel concurrency operations.

Bugfixes
~~~~~~~~

* Fix an issue in code generation where the ``ReadBurst`` memory functions could lock up when the consumer was too slow.

Reconfigure.io v0.16.3
======================

This is a bugfix release fixing generated code causing a crash in some vendor tooling.

Bugfixes
~~~~~~~~

* Altered the representation of BRAM initilization constants to prevent segfaults during synthesis.


Reconfigure.io v0.16.2
======================

This is a bugfix release targeting bugs in consecutive channel reads and graph generation.

Features
~~~~~~~~

* Optimized code generation in the case of consecutive channel reads, reducing the size of the resulting circuit on the FPGA.

Bugfixes
~~~~~~~~

* Fixed a bug which caused graph generation to crash.
* Fixed a bug in code generation where consecutive channel reads would result in code that would not build on FPGAs.


Reconfigure.io v0.16.0
======================

In this release, we have open sourced our Go libraries that were previously included as part of the build process. This allows for better integration with local tooling.

* `Repository <https://github.com/ReconfigureIO/sdaccel>`_
* `GoDoc <https://godoc.org/github.com/ReconfigureIO/sdaccel>`_

Upgrading
~~~~~~~~~

This upgrade is purely an opt-in process. The previous packages will continue to work.

If you'd like to upgrade, we provide a `tool to automigrate your code <https://github.com/ReconfigureIO/sdaccel/cmd/fix>`_. Run it like so::

  $ go install github.com/ReconfigureIO/sdaccel/cmd/fix
  # In your project directory
  $ fix .

You'll also need to use `Go's vendor mechanism <https://blog.gopheracademy.com/advent-2015/vendor-folder/>`_ to vendor the version of our tools you'd like to use. We recommend using `Glide <http://glide.readthedocs.io/en/latest/getting-started/>`_ to manage the vendor folder::

  $ glide create --non-interactive
  $ glide install
  $ ls vendor/github.com/ReconfigureIO/sdaccel
  axi  cmd  control  LICENSE  Makefile  stubs  verilog  xcl  framework.go  CODE_OF_CONDUCT.md  README.md  docker-compose.yml


Features
~~~~~~~~

* Our compiler now supports multiple function arguments with the same type, of the form: ``func myFunction(a, b, c int)``

Bugfixes
~~~~~~~~

* The compiler now correctly typechecks arguments to functions.

  Previously, some types with equal representation would be allowed (e.g. ``uint`` and ``uint32``) interchangably as arguments to a function call. This fixes that, and improves error messages in the cases that were already covered.


Reconfigure.io v0.15.0
======================

This release marks our public beta! We're tremendously excited to put the
Reconfigure.io product out into the world. In addition, this release contains
performance tweaks that will improve the speed of much real-world code.

API Documentation
~~~~~~~~~~~~~~~~~

* `kernel docs <http://godoc.reconfigure.io/v0.15.0/kernel/pkg>`_
* `host docs <http://godoc.reconfigure.io/v0.15.0/host/pkg>`_

Features
~~~~~~~~

* The compiler now supports an optimization known as operator pipelining. Whenever the compiler encounters
  a loop that processes data arithmetically, it converts that loop into a highly-efficient pipeline on the
  FPGA, during which one piece of data may allow a subsequent piece of data to start before the current
  datum has finished processing. Parallel stages are balanced through latch insertion. This provides
  drastic speedups to any program that features looped processing of data.
* We have adjusted the optimization rules to take advantage of highly-pipelined programs.

Bugfixes
~~~~~~~~

* Bugs in on-chip SELF components have been fixed.
* Potential inefficiencies when mixing constants and variables in arithmetic operators have been removed.

Reconfigure.io v0.14.0
======================

This release delivers performance improvements.

API Documentation
~~~~~~~~~~~~~~~~~

* `kernel docs <http://godoc.reconfigure.io/v0.14.0/kernel/pkg>`_
* `host docs <http://godoc.reconfigure.io/v0.14.0/host/pkg>`_

Features
~~~~~~~~

* The compiler can now inline idempotent constant functions, which can lead to significant performance improvements.
* A new optimization algorithm has been applied, which can rewrite arithmetic expressions into more-performant equivalents.

Bugfixes
~~~~~~~~

* Bugs in the implementation of low-level SELF components have been fixed.
* Latches that break loops have been made more correct.


Reconfigure.io v0.13.0
======================

This release delivers major performance improvements.

API Documentation
~~~~~~~~~~~~~~~~~

* `kernel docs <http://godoc.reconfigure.io/v0.13.0/kernel/pkg>`_
* `host docs <http://godoc.reconfigure.io/v0.13.0/host/pkg>`_

Features
~~~~~~~~

* Added ability to specify constant capacities to channels, e.g. ``c := make(chan uint, 3)`` provides a channel of capacity 3.
* Latch reduction was overhauled, resulting in more efficient networks. Kernels are typically 30% - 50% faster than they were before.
* Kernels are now reset before running, fixing issues with some kernels locking up after multiple runs.

Bugfixes
~~~~~~~~

* Multiple variables may be declared in one var declaration, as per the Go spec.

Reconfigure.io v0.12.8
======================

This is a minor performance release.

API Documentation
~~~~~~~~~~~~~~~~~

* `kernel docs <http://godoc.reconfigure.io/v0.12.8/kernel/pkg>`_
* `host docs <http://godoc.reconfigure.io/v0.12.8/host/pkg>`_

Features
~~~~~~~~

* Improved performance of channels, saving 3 cycles for a send/receive pair.
* Improved performance by combining variable writes where possible.

Libraries
~~~~~~~~~

* Released a `cryptography library <https://github.com/ReconfigureIO/crypto>`_

Reconfigure.io v0.12.7
======================

This is a bugfix release that unblocks the release of our fixed point library.

API Documentation
~~~~~~~~~~~~~~~~~

* `kernel docs <http://godoc.reconfigure.io/v0.12.7/kernel/pkg>`_
* `host docs <http://godoc.reconfigure.io/v0.12.7/host/pkg>`_

Bugfixes
~~~~~~~~

* Fixed a bug where casting to a type in another package would cause an error
* Fixed a bug where vendor packages weren't being considered in host side code
* Fixed a bug where dependencies of dependencies would cause an error

Features
~~~~~~~~

* Internal rework of our channel implementation, which should give us
  a better foundation in the future. You may notice slight performance
  regression because of this, until we make sure it has performance
  parity with the previous implementation.

Libraries
~~~~~~~~~

* Released a `fixed point arithmetic library <https://github.com/ReconfigureIO/fixed>`_

Reconfigure.io v0.12.6
======================

This is a bugfix release to handle an issue specific to Windows.

API Documentation
~~~~~~~~~~~~~~~~~

* `kernel docs <http://godoc.reconfigure.io/v0.12.6/kernel/pkg>`_
* `host docs <http://godoc.reconfigure.io/v0.12.6/host/pkg>`_

Bugfixes
~~~~~~~~

* Fixed a bug where directories from input artifacts were not treated as directories. This could manifest in unfound executables.

Reconfigure.io v0.12.5
======================

This is a minor release to officially support external libraries in our build process.

API Documentation
~~~~~~~~~~~~~~~~~

* `kernel docs <http://godoc.reconfigure.io/v0.12.5/kernel/pkg>`_
* `host docs <http://godoc.reconfigure.io/v0.12.5/host/pkg>`_

Features
~~~~~~~~

* Kernels can now include a ``vendor`` directory, much like Go's vendor support.
* ``reco`` is now versioned, with the release of v0.2.0. If you have previously downloaded ``reco``, run the new commands in :ref:`setup`.
* ``reco check`` will now auto update.

Reconfigure.io v0.12.4
======================

This is a minor release to improve some error messages.

API Documentation
~~~~~~~~~~~~~~~~~

* `kernel docs <http://godoc.reconfigure.io/v0.12.4/kernel/pkg>`_
* `host docs <http://godoc.reconfigure.io/v0.12.4/host/pkg>`_

Features
~~~~~~~~

* Improved error messages when using an identifier incorrectly


Reconfigure.io v0.12.3
======================

This is a bugfix release, focused on fixing bugs & performance issues found in larger programs.

API Documentation
~~~~~~~~~~~~~~~~~

* `kernel docs <http://godoc.reconfigure.io/v0.12.3/kernel/pkg>`_
* `host docs <http://godoc.reconfigure.io/v0.12.3/host/pkg>`_

Features
~~~~~~~~

* Automatic pruning of unused code. Synthesis of generated code is now faster, and compilation to Verilog is 10x faster.
* Improved error messages when trying to use a struct as a function.

Bugfixes
~~~~~~~~

* Compiler now checks to ensure that a function has a return statement.
* Fixed scoping bug in reco check.
* Fixed bug where identifiers that did not begin with an uppercase letter were exported.
* Improved the error message when attempting to shift by a negative number

Reconfigure.io v0.12.1
======================

This is a bugfix release, focused on fixing issues identified by larger example programs.

API Documentation
~~~~~~~~~~~~~~~~~

* `kernel docs <http://godoc.reconfigure.io/v0.12.1/kernel/pkg>`_
* `host docs <http://godoc.reconfigure.io/v0.12.1/host/pkg>`_

Features
~~~~~~~~

* Algorithm optimizations in our optimization engine, decreasing compile times for larger programs by a significant amount. This will be most noticeable on simulations, where compile times take a significant amount of the total runtime.
* Performance improvements in our AXI arbitration library.

Bugfixes
~~~~~~~~

* Fixed an issue coercing literals to type aliases.
* Fixed an issue with uninitialized variables causing a compiler error.
* Fixed an issue where high fanout wires could be generated in output Verilog.

Reconfigure.io v0.12.0
======================

Features
~~~~~~~~

* Added the ability to generate and view PDFs of the intermediate graphs. See ``reco graph`` and it's accompanying documentation.
* Reworked the ``reco`` command line tool to break out subcommands

Bugfixes
~~~~~~~~

* Fixed certain arithmetic expressions that were treated as ill-typed due to improper constant propagation


Reconfigure.io v0.11.0
======================

Features
~~~~~~~~

* Constant expressions in array lengths are now supported.

* Improved performance of optimization rules.

* Improved overall performance by preventing RAM generation for insufficiently-large arrays.

* Reduced compile times by tweaking the optimization engine.

* A 15 minute time limit has been added to simulation times.

* A 12 hour time limit has been added to build times.

Bugfixes
~~~~~~~~

* Fixed inconsistent RAM instantiation, which was resulting in breaking code.
* Fixed reco-check - no longer giving an error on ``float32`` & ``float64``.


Reconfigure.io v0.10.0
======================

**We’re excited to announce that deployments to F1 instances are now operational!**

Feature
~~~~~~~

* Deployments, created through the ``reco run`` command, are now enabled on all accounts.


Reconfigure.io v0.9.1
=====================

This release is focused on performance improvements in the compiler.

Feature
~~~~~~~~~~~~~~~~~

* Heuristics were added to the compiler to combine arithmetic & logical operators, improving area & speed. For more details, see `our post about it <https://community.reconfigure.io/t/tada-reconfigure-io-v0-9-1-is-released-tada/43/>`_.
* The ``reco check`` command now respects projects, like the other commands.

Reconfigure.io v0.9.0
=====================

This release is focused on providing a quick way to check your code is compatible with our compiler.

Feature
~~~~~~~~~~~~~~~~~

* Inclusion of the command ``reco check``, allowing for users to type check kernel code locally.

Bugfixes
~~~~~~~~~~~~~~~~~

* Fixed Windows bugs for ``reco``.

* Optimization rules for small arrays have been adjusted, fixing long build times.

* Error messages upon encountering unsupported defer-statements have been improved.

Reconfigure.io v0.8.0
=====================

This release is focused on enabling RAMs & documentation of the API.

API Documentation
~~~~~~~~~~~~~~~~~

* `kernel docs <http://godoc.reconfigure.io/v0.8.0/kernel/pkg>`_
* `host docs <http://godoc.reconfigure.io/v0.8.0/host/pkg>`_


Features
~~~~~~~~

* Add publishing of godoc to the build process.

* Support RAM blocks for arrays of sufficient size, providing significant performance improvements.

Bugfixes
~~~~~~~~

* Arrays larger than 2^31 - 1 are now formally rejected by the compiler.

* A bug associated with side-effects in binary assignment operators has been fixed.

* Use of unsupported multiple-assignment is now flagged rather than failing silently.

* The behavior of the _ wildcard now complies more closely with the mainline Go compiler.

* Issues with generating invalid Verilog variable names have been fixed.




Reconfigure.io v0.6.0
=====================

This release is focused on optimizations and bugfixes in the compiler.

Features
~~~~~~~~
* Enable intermediate variable analysis & optimizations.

More code should be able to run without synthesis errors, and code
that relied on intermediate variables should see a significant
increase in performance.

* Anonymous structs are now supported.

* Octal literals are now supported.

Bugfixes
~~~~~~~~
* Position information has been attached to more error messages.

* Bugs in parsing certain hexadecimal literals have been fixed.

* For-loops that omitted a final statement would be rejected. This has been fixed.

Reconfigure.io v0.5.0
=====================

This release is focused on speed and reliability of the build process,
and introduces our new ``reco`` tool.

Features
~~~~~~~~
* ``reco`` is now the preferred tool. Workflows using ``reco-jarvice`` will still work, but are deprecated.

Bugfixes
~~~~~~~~
* Fix a hardware configuration that allowed ``The placer database file is corrupted. Expected (section_tag_sitecontent): 0xdead3333 found: 0`` to happen under load.

Reconfigure.io v0.4.0
=====================

This release is focused on expanding concurrency primitives, and
providing better error messages.

Features
~~~~~~~~

* Multiple go routines can now write to a channel.
* Error messages are now easier to understand, colourized, tagged and location-aware.


Bugfixes
~~~~~~~~
* Simplification of output verilog.


Reconfigure.io v0.3.0
=====================

This release is focused on adding concurrency primitives to the compiler.

Features
~~~~~~~~

* Added preliminary support for ``select`` statements.

``select`` statements of the following form are supported.

.. code-block:: go

  select {
    case a <- chan1:
    case b <- chan2:
  }


Several restrictions apply:

  * It is not possible to output to a channel in a ``select`` statement.
  * Input channels must be static identifiers.
  * Using multiple ``select`` statements with the same channel will result in an error.

* Added ``MemoryReader`` & ``MemoryWriter`` with corresponding ``io.Reader`` and ``io.Writer`` instances to the ``xcl`` library.

Bugfixes
~~~~~~~~
* Fixed some issues with variable sythesis causing crashes.
* Fixed possible segfaults in ``xcl``.


Reconfigure.io v0.2.1
=====================

This release is focused on improving the compiler, and improving the reliability of the build process.

Features
~~~~~~~~

* We have made the build process more resilient to network issues, which means fewer failures.
* Multiplication & division have been enabled. All of Go's arithmetic & logical operators are now supported.
* Compiler error messages will now include line & column information.

Bugfixes
~~~~~~~~
* Fixed an issue with assignment to struct members.
* Fixed an issue with side-effecting returns in for loops.
* An error message is thrown if the user attempts to assign to a channel more than once.


Reconfigure.io v0.1.0
=====================

This is the first alpha release of our tooling, allowing the
development and deployment of kernels written in Go to FGPAs using the
SDAccel framework.

* Initial support for translating a single Go file.
* Libraries to support 32 bit access to on-card memory.
* Support for simulating & building FGPA accelerated applications,
  through the ``reco-jarvice`` command line tool.

Language Limitations
~~~~~~~~~~~~~~~~~~~~

The Reconfigure.io tooling and compiler are in an alpha state. Though our offering is polished enough to get real-world tasks done, there are as of yet some rough edges and incompatibilities. These will all be addressed in subsequent releases, and we appreciate your patience in the meantime.

A core part of the language is supported, including functions,
methods, and primitive operators. The following limitations apply in this release:

No Multiply or Divide
---------------------

You may be able to work around this limitation through bitshifts and repeated addition.

Large arrays cause problems
---------------------------

Depending on the underlying type, arrays of more than length 64 may
result in code that cannot be run on an FPGA. To work around this, use
the memory interface.

Order of Declaration Matters
----------------------------

You can't use a function that's declared later than it's used in your
code. To work around this, only use a function or method after it's
declared.

Libraries
---------

Most libraries will not work on FPGAs. If this interferes with your vision, please let us know which libraries you'd like to see supported by the Reconfigure.io tooling and compiler.

No Floating Point
-----------------

The alpha release does not support IEEE-754 floating point operations, as expressing IEEE-754 on an FPGA is a nontrivial problem. This will be addressed in future releases!

No Maps or Interfaces
---------------------

You may be able to work around the lack of maps with judicious use of arrays.

Static channels
---------------
Channels must be statically resolvable at compile time. In this case,
you may bind a channel to a name only once. The following code will error::

  func badChannelUsage(){
       c := make(chan int)
       b = c
  }

No Pointers or Slices
---------------------

Pointers & slices are not supported. Some slice usage can be replaced by arrays.



Tool Limitations
~~~~~~~~~~~~~~~~

Build, simulations & running jobs are limited to a 2 hour timeout.

Tooling only supports 'Jarvice' provider. In future ``reco-jarvice`` will be replaced with ``reco`` which will support multiple cloud providers.
