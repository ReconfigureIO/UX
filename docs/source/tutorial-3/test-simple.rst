8 – Test your code
------------------
Now you can test your code in your local Go environment. Make sure you're in the top directory of your project ``$GOPATH/src/github.com/<your-github-username>/tutorials/multiply1`` and run ``go test``. If all is well with your FPGA-side code you should see::

  $ go test
  PASS
  ok  	github.com/ReconfigureIO/tutorials/multiply1	0.007s

Next you can head over to your host code (``$GOPATH/src/github.com/<your-github-username>/tutorials/multiply1/cmd/test-multiply1/main.go``) and check it builds with the Go compiler by running ``go build``.
