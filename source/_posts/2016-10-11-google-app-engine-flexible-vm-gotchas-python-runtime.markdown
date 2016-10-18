---
layout: post
title: "Google App Engine Flexible VM Gotchas (Python Runtime)"
date: 2016-10-11 15:21:29 +0300
comments: true
categories: 
published: false
---
If you're migrating from the Google App Engine Standard environment to the Flexible environment, here a few things you may need to note. Some are documented, others, well, you just find out on your own.

1. `python-compat` runtime does not support python 3, therefore you can't access App engine APIs in the `python-compat`. One work around is to use the [Google Cloud Client Library](https://github.com/GoogleCloudPlatform/google-cloud-python) but it doesn't support certain APIs such as the Task Queue API and Search API, Iamges API.

2. [Background threads API](https://cloud.google.com/appengine/docs/python/refdocs/google.appengine.api.background_thread.background_thread) is not supported in the `python-compat` runtime.

3. Pre-emptible VMs cannot be used as Flexible VMs.


4. Its in BETA - so not covered by deprecation policy

If your using the `python-compat` or `python27` runtime:

The following APIs are note supported.






http://stackoverflow.com/questions/39729271/how-to-configure-app-engine-flexible-environment-to-use-google-preemptible-vms-i