4 – Test your code
------------------
Now you can test your program for syntax and semantic errors within your Go environment. We've included a test file – ``main_test.go`` which will check that the function ``Add`` at the top of the FPGA code does what's it's supposed to. So, let's test that first. Make sure you're in ``your-github-username/tutorials/addition-gaps`` and run ``go test``. All being well you should see something like::

  $ go test
  PASS
  ok  	github.com/your-github-username/tutorials/addition-gaps	0.007s

If there are any errors in your code they will be flagged up here for you to fix. A pass tells us that your code is compatible with the Go compiler, and the ``ADD`` function does what we're expecting.

Next navigate to ``your-github-username/tutorials/addition-gaps/cmd/test-addition`` and run ``go test``, and hopefully you'll see::

  $ go test
  PASS
  ok  	github.com/your-github-username/tutorials/addition-gaps/cmd/test-addition	0.007s

If not, you will be able to see where any errors are located. A pass here tells us that your CPU code is compatible with the Go compiler.
