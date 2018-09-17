Filling in the gaps
-------------------
Now navigate to ``your-github-username/tutorials/addition-gaps/cmd/test-addition/main.go`` to look at the incomplete code for the host CPU. You will notice some of the code is missing. Using the information given in the comments, along with the flowchart above, you can have a go at filling in the missing sections.

First, as we're going to be editing existing code, let's make a new branch to work on, call it ``fill-gaps``::

  git checkout -b fill-gaps

Here's what needs completing:

* Pass operands and results pointer to the FPGA (**lines 28, 30 and 32**)
* Print the result from the FPGA (**line 48**)
* Create an ``if`` statement to exit if the result from the FPGA does not equal what we expect (**lines 51-53**)

Once you have completed this, move on to the incomplete code for the FPGA, located at ``your-github-username/examples/addition-gaps/main.go``, and complete the following sections:

* Specify the operands and result pointer from the host (**lines 24-26**)
* Perform the addition (**line 40**)

Once you've made your changes you can stage and commit them to your ``fill-gaps`` branch::

  git add main.go && cmd/test-addition/main.go
  git commit -m "code completed"
  git push origin fill-gaps
