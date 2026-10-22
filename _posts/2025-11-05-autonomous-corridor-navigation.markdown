---
layout: post
title: "Autonomous Navigation and Semantic Goal Seeking"
author: Giacomo Vianello
authors: <strong>G Vianello</strong>, S Ferracane
categories: Research
image: /images/nav.gif
code: https://github.com/GiacomoVianello-1/IR_assignment_1_07
paper: /pdfs/07_assignment1.pdf
venue: Intelligent Robotics - University of Padua
abstract: "A hybrid autonomous navigation framework developed in ROS2 for a TurtleBot3 operating in complex environments. Adopting a supervisory Plan-Sense-Act architecture, the system combines Nav2 global path planning, AprilTag visual detection for semantic midpoint goal generation, and real-time DBSCAN LiDAR clustering for obstacle localization. To navigate narrow passages where standard planners degrade, a custom reactive PD controller autonomously executes corridor traversal, ensuring robust collision-free guidance and seamless mission continuity."
---
Hybrid ROS2 navigation pipeline combining Nav2 planning, AprilTag visual detection, and reactive LiDAR control for corridor traversal.