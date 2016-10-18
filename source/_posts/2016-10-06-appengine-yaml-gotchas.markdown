---
layout: post
title: "Appengine yaml gotchas"
date: 2016-10-06 21:42:40 +0300
comments: true
categories: 
published: false
---

1. Task Queues must be imdepotent

2. Use Pipelines API with caution, only where deferre tasks do not suffice. Because Pipelines API aggresively uses the datastore to keep track of state changes, and may consume your quota.

3. Flexible VM defaults is 2 instances with 1.75GB