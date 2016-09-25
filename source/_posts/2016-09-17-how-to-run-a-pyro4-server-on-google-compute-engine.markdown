---
layout: post
title: "How to run a Pyro4 server on Google Compute Engine"
date: 2016-09-17 16:01:15 +0300
comments: true
categories: 
published: false
---

Pyro4 is an awesome library that allows you to access remote python objects from your python code.

You can also use it from within java using xxxx.

One of the things that 

To be able to run a pyro server on google compute engine, you need to change your network rules to permit TCP and UDP access on the port pyro's running on (pyro runs on port 9000 by default)

Method 1:
(Only works @ creation time)

command line method

Method2:
use inteface