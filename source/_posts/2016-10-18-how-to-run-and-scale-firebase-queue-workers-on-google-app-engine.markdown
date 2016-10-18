---
layout: post
title: "How To Run &amp; Scale Firebase Queue Workers On Google App Engine"
date: 2016-10-18 12:23:32 +0300
comments: true
categories: [firebase, firebase-queue, google-app-engine, nodejs]
---
If you're using Firebase with a server to perform tasks like generating thumbnails of images, filtering message contents and censoring data, or fanning data out to multiple locations in your Firebase database, chances are you're using (or [need to use]((https://firebase.googleblog.com/2015/05/introducing-firebase-queue_97.html)) [Firebase Queue](https://github.com/firebase/firebase-queue).

>[Firebase Queue](https://github.com/firebase/firebase-queue) is a fault-tolerant multi-worker job pipeline built on Firebase. It provides you with a way to organize workers or perform background work on your Firebase database or files.

This isn't a tutorial on how to use firebase-queue, it is simply to show you how you can host & run your queue workers in a scalable environment ([Google app engine](https://cloud.google.com/appengine/)). <!-- more -->If you're want to learn how to use Firebase Queues, there's a great guide [here](https://github.com/firebase/firebase-queue/blob/master/docs/guide.md).

***Note:** Firebase-queue is only available for Node.js, so we shall be using the [App Engine Node.js flexible runtime](https://cloud.google.com/appengine/docs/flexible/nodejs/runtime).*

#Why Google Appengine?

[Google app engine](https://cloud.google.com/appengine/) provides an easy to use platform for developers to build, deploy, manage and automatically scale services on Google’s infrastructure. There are no servers for you to provision or maintain.

#Installing

Assuming you’ve already installed [Node.js](https://nodejs.org/), create a directory to hold your application, and make that your working directory.
{% highlight shell %}
$ mkdir myapp
$ cd myapp
{% endhighlight %}

Use the npm init command to create a `package.json` file for your application. For more information on how package.json works, see [Specifics of npm’s package.json handling](https://docs.npmjs.com/files/package.json).

{% highlight shell %}
$ npm init
{% endhighlight %}

This command prompts you for a number of things, such as the name and version of your application. For now, you can simply hit RETURN to accept the defaults for most of them, with the following exception:
{% highlight shell %}
entry point: (index.js)
{% endhighlight %}


Enter `app.js`, or whatever you want the name of the main file to be. If you want it to be `index.js`, hit RETURN to accept the suggested default file name.

Now install [Express](https://www.npmjs.com/package/express), [Firebase](https://www.npmjs.com/package/firebase) & [Firebase-Queue](https://www.npmjs.com/package/firebase-queue) dependencies in the myapp directory and save them in the dependencies list.

{% highlight shell %}
$ npm install express --save
$ npm install firebase firebase-queue --save
{% endhighlight %}

Next you need to [install Google Cloud SDK](https://cloud.google.com/sdk/docs/), in order to be able to deploy to app engine.

#Coding the app


In the myapp directory, in the `app.js` file you created above, start your queue worker as shown below:
{% highlight javascript %}
var express = require('express');
var app = express();

var firebase = require("firebase");
firebase.initializeApp({
  serviceAccount: "service_account.json",
  databaseURL: "https://databaseName.firebaseio.com"
});

var Queue = require('firebase-queue')


//start your worker here
var ref = firebase.database().ref('queue');
var queue = new Queue(ref, function(data, progress, resolve, reject) {
  // Read and process task data
  console.log(data);

  // Do some work
  progress(50);

  // Finish the task asynchronously
  setTimeout(function() {
    resolve();
  }, 1000);
});


app.get('/', function (req, res) {
  res.send('The Firebase Queue worker is running!');
});

var server = app.listen(process.env.PORT || '8080', function () {
  console.log('App listening on port %s', server.address().port);
  console.log('Press Ctrl+C to quit.');
});
{% endhighlight %}

The above code starts a queue worker which simply logs the task data passed to it, and then starts an express server.
This worker will continue running for as long as the instance is running.

Next, you need to create an `app.yaml` file in the myapp directory, which will be used to deploy the app to appengine.

{% highlight yaml%}
runtime: nodejs
vm: true 
{% endhighlight %}

Before we can deploy, we need to edit the `"scripts"` and `"engines"` properties in the `package.json` file so that our app can run on app engine.

{% highlight json%}
"engines": {
    "node": "~4.2"
  },
"scripts": {
    "start": "node app.js",
    "monitor": "nodemon app.js",
    "deploy": "gcloud app deploy"
  }
{% endhighlight %}

Finally, deploy the app to appengine:

{% highlight shell%}
$ gcloud app deploy app.yaml
{% endhighlight %}


To test the worker, you can push an object with some data to the tasks subtree of your queue:

{% highlight shell%}
# Using curl in shell
$ curl -X POST -d '{"foo": "bar"}' https://databaseName.firebaseio.com/queue/tasks.json
{% endhighlight %}

You should see '{"foo": "bar"}' somewhere in your logs, or which ever data you posted.


Although the `app.js` code above initialized only one worker, Queue Workers can take options to specify the number of initial workers to run simultaneously for a single node.js thread.

{% highlight javascript%}
var options = {
  'specId': 'spec_1',
  'numWorkers': 5,
};

var queue = new Queue(ref, options, function(data, progress, resolve, reject) {
  ...
});
{% endhighlight %}

The above code initializes 5 workers on a single thread. Depending on your application needs and CPU resources, you may want to initalize multiple workers.

#Scaling on App engine

Every app engine application is auto-scaled by default basing on certain default parameters. However, you can control how/when you want your app to be scaled. You can use either auto or manual scaling, depending in your application needs.

Here's an example of how to configure your `app.yaml` for auto-scaling:

{% highlight yaml%}
#auto scaling
automatic_scaling:
  min_num_instances: 1
  max_num_instances: 10
  cool_down_period_sec: 120 # default value
  cpu_utilization:
    target_utilization: 0.75
{% endhighlight %}

You only need to specify the minimum and maximum number of instances when using auto-scaling, the rest are optional.
App engine will average CPU use across running instances. The value your specify for `target_utilization` is used to determine whether to reduce or increase the number of instances.


Manual scaling is suitable if you can reliably predict your worker's load @ all times. Auto-scaling is more suitable if your app (queue workers) experiences spikes in usage. See example below:
{% highlight yaml%}
#manual scaling
manual_scaling:
  instances: 3
{% endhighlight %}

You can also specify the computing power/resources for each instance, depending on your needs:
{% highlight yaml%}
resources:
  cpu: .5
  memory_gb: 1.3
  disk_size_gb: 10
{% endhighlight %}
`cpu` represents the number of cores (it can be less than a fraction). `memory_gb` is RAM in GB.


>The beauty of Firebase-Queue is that multiple queue workers can be initialized on multiple machines and Firebase-Queue will ensure that only one worker is processing a single queue task at a time. So using Google App Engine is a nice way to autoscale your firebase worker-queues.

And that's how you can effortlessly scale firebase queue workers with Google App engine. Got any questions? Ping me on Twitter: [@TimAsiimwe](https://twitter.com/TimAsiimwe), I’d be happy to chat!


***Note:** In order to use Flexible VMs, you need to enable billing for your project in the [Google Cloud Console](https://console.cloud.google.com).*

For more on how to configure your app engine app, read [the documentation](https://cloud.google.com/appengine/docs/flexible/nodejs/configuring-your-app-with-app-yaml).

References:
https://expressjs.com/en/starter/installing.html
https://github.com/firebase/firebase-queue/blob/master/docs/guide.md