---
layout: post
title: "Autonomous Navigation and Semantic Goal Seeking"
author: Giacomo Vianello
authors: <strong>G Vianello</strong>, S Ferracane
categories: Research
image: /images/nav_robot.png
code: https://github.com/GiacomoVianello-1/IR_assignment_1_07
paper: /pdfs/07_assignment1.pdf
venue: Intelligent Robotics - University of Padua
abstract: "A ROS2-based autonomous navigation system for a mobile robot in a simulated environment. The project implements a multi-modal architecture combining Nav2 for global path planning, AprilTag detection for semantic goal identification, and a custom Lidar-based controller for stable corridor navigation."
---
This project implements an autonomous navigation pipeline for a TurtleBot 3 that integrates AprilTag recognition with a hybrid control strategy. The system calculates target goals between detected markers and transitions from global Nav2 planning to a custom LiDAR-based PD controller for stable corridor traversal. By combining modular C++ orchestration with real-time DBSCAN clustering, the robot effectively localizes cylindrical obstacles while maintaining seamless mission continuity.