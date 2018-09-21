12 – Test your code
------------------
As you have used the same multiplication function as you used for the previous example, you can use the same test file to test your code too. So let's do that next. Make sure you're in the top directory of your project ``$GOPATH/src/github.com/<your-github-username>/tutorials/multiply-array`` and run ``go test``. If all is well you should see::

  $ go test
  PASS
  ok  	github.com/ReconfigureIO/tutorials/multiply-array	0.007s

Next head to the host-side code (``tutorials/multiply-array/cmd/test-multiply-array``) and check the code with the Go compiler by running ``go build``.
