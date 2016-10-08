---
layout: post
title: "How To Run &amp; Scale Firebase Queue Workers on Google App Engine"
date: 2016-10-08 17:31:50 +0300
comments: true
categories: 
---
If you're using Firebase with a server to perform tasks like perform background work like generating thumbnails of images, filtering message contents and censoring data, or fanning data out to multiple locations in your Firebase database, chances are using (or need to use) [firebase-queue](https://firebase.googleblog.com/2015/05/introducing-firebase-queue_97.html)

This isn't a tutorial on how to use [firebase-queue](https://github.com/firebase/firebase-queue), it is simply to show you how you can host your queue workers in a scalable environment (Google app engine). <!-- more -->If you're want to learn how to use Firebase Queues, there's a great guide [here](https://github.com/firebase/firebase-queue/blob/master/docs/guide.md).

firebase-queue is only available for Node.

#Why Google Appengine?

[Google app engine](https://cloud.google.com/appengine/) provides an easy to use platform for developers to build, deploy, manage and automatically scale services on Google’s infrastructure. There are no servers for you to provision or maintain.

#Installing

Assuming you’ve already installed [Node.js](https://nodejs.org/), create a directory to hold your application, and make that your working directory.
{% highlight shell %}
$ mkdir appengine-firebase-queue
$ cd appengine-firebase-queue
{% endhighlight %}

Use the npm init command to create a `package.json` file for your application. For more information on how package.json works, see [Specifics of npm’s package.json handling](https://docs.npmjs.com/files/package.json).

{% highlight bash %}
$ npm init
{% endhighlight %}

This command prompts you for a number of things, such as the name and version of your application. For now, you can simply hit RETURN to accept the defaults for most of them, with the following exception:
{% highlight bash %}
entry point: (index.js)
{% endhighlight %}


Enter `app.js`, or whatever you want the name of the main file to be. If you want it to be `index.js`, hit RETURN to accept the suggested default file name.

Now install Express, Firebase & Firebase-Queue dependencies in the appengine-firebase-queue directory and save them in the dependencies list.

{% highlight shell %}
$ npm install express --save
$ npm install firebase firebase-queue --save
{% endhighlight %}

Next you install [Google Cloud SDK](https://cloud.google.com/sdk/docs/), in order to be able to deploy to app engine.

#Coding the app


In the appengine-firebase-queue directory, create a file named `app.js` and add the following code:
{% highlight javascript %}
var express = require('express');
var app = express();

var firebase = require("firebase");
firebase.initializeApp({
  serviceAccount: "Newzy-e5b78e76caa2.json",
  databaseURL: "https://newzy-34bc0.firebaseio.com"
});
var db = firebase.database();
var ref = db.ref("comments");
ref.on("value", function(snapshot) {
  console.log(snapshot.val());
});

var Queue = require('firebase-queue')


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


The app starts the server which listens on port 8080, but more importantly, it also

Next, you need to create an `app.yaml` file in the appengine-firebase-queue directory, which will be used to deploy the app to appengine.

{% highlight yaml%}
runtime: nodejs
vm: true 
{% endhighlight %}

Lastly, we need to edit the package.json file so that our app can run on app engine. Add a scripts and engines.

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

#Scaling on App engine

Every app engine application is [auto-scaled](https://cloud.google.com/appengine/docs/flexible/nodejs/configuring-your-app-with-app-yaml#services) by default basing on certain default parameters. However, you can control how/when you want your app to be scaled. You can use either auto or manual scaling, you just need to configure your `app.yaml` accordingly. For example:

{% highlight yaml%}
#auto scaling
automatic_scaling:
  min_num_instances: 1
  max_num_instances: 10
  cool_down_period_sec: 120 # default value
  cpu_utilization:
    target_utilization: 0.5
{% endhighlight %}

Manual scaling is suitable if you can reliably predict your application's load @ all times. Auto-scaling is more suitable is your app(queue) experiences spikes in usage. Read about how to configure scaling in your `app.yaml` [here](https://cloud.google.com/appengine/docs/flexible/nodejs/configuring-your-app-with-app-yaml#services).

You can also specify the computing power/resources for each instance:
{% highlight yaml%}
resources:
  cpu: .5
  memory_gb: 1.3
  disk_size_gb: 10
{% endhighlight %}
Read more about how to configure resources [here](https://cloud.google.com/appengine/docs/flexible/nodejs/configuring-your-app-with-app-yaml#resource-settings).

App engine will reduce or increase the number of instances of your app basing on the load (and your scaling configuration), and since, we initialize a firebase-queue in our app.js, a new queue worker will be created everytime a new instance is created. So, `number of instances == number of queue workers`.

>The beauty of Firebase-Queue is that multiple queue workers can be initialized on multiple machines and Firebase-Queue will ensure that only one worker is processing a single queue task at a time. So using Google App Engine is a nice way to autoscale your firebase worker-queues.


To learn more about Firebase-Queue, read [this guide](https://github.com/firebase/firebase-queue/blob/master/docs/guide.md).

Please note Firebase Queues are only available in Node.js


***Note:** In order to use Flexible VMs, you need to enable billing for your project in the [Google Cloud Console](https://console.cloud.google.com).*


References:
https://expressjs.com/en/starter/installing.html